import fs from 'fs';
import path from 'path';
import amqplib from 'amqplib';
import Docker from "dockerode";
import { S3 } from "@aws-sdk/client-s3";
import { spawnSync } from "child_process";
import { createPool } from '@vercel/postgres';
import dotenv from "dotenv";

dotenv.config({
    path: path.join(__dirname, '..', '.env')
});

const QUEUE_NAME = process.env.QUEUE || 'tasks';
const QUEUE_URL = process.env.QUEUE_URL || 'amqp://localhost';
const BUCKET_NAME = process.env.BUCKET_NAME || 'mybucket';
const BUCKET_URL = process.env.BUCKET_URL || 'http://localhost:9000';
const BUCKET_USER = process.env.BUCKET_USERNAME || 'admin';
const BUCKET_PASSWORD = process.env.BUCKET_PASSWORD || 'password';

const PREFIX = 'arena';
const DOCKER_IMAGE = 'arena_validator';

const docker = new Docker();
const pool = createPool({
    connectionString: process.env.POSTGRES_URL!,
});



// Configure AWS SDK to point to the local MinIO instance
const s3 = new S3({
    endpoint: BUCKET_URL,
    credentials: {
        accessKeyId: BUCKET_USER,
        secretAccessKey: BUCKET_PASSWORD
    },
    region: 'us-east-1',
    forcePathStyle: true,
});

/**
 * Download a file from S3
 *  
 * @param key The key of the file in the bucket
 * @param downloadPath The path to save the downloaded file
 */
async function downloadFile(key: string, downloadPath: string) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
    };

    try {
        const data = await s3.getObject(params);
        if (!data.Body) {
            throw new Error('No data in response');
        }
        const dataString = await data.Body.transformToString();
        fs.writeFileSync(downloadPath, dataString);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}


/**
 * Get the file extension based on the language
 * @param language  The language of the code
 * @returns The file extension
 */
function getExtension(language: string) {
    switch (language) {
        case 'cpp':
        case 'c++':
            return 'cpp';
        case 'python':
            return 'py';
        default:
            return '';
    }
}

/**
 * Execute the code in a Docker container
 * @param language Language of the code
 * @param problemId Problem ID
 */
async function executeCodeInDocker(language: string, problemId: string): Promise<number> {

    let command = '';
    let inputFilePath = `/${problemId}.in`;
    let userOutputFilePath = `/${problemId}.user.out`;

    console.log(language);
    if (language === 'python') {
        command = `python3  solution.py < ${path.basename(inputFilePath)} > ${path.basename(userOutputFilePath)}`;
    } else if (language === 'cpp' || language === 'c++') {
        command = `g++ solution.cpp -o solution && ./solution < ${path.basename(inputFilePath)} > ${path.basename(userOutputFilePath)}`;
    }

    const container = await docker.createContainer({
        Image: DOCKER_IMAGE,
        Cmd: ['/bin/sh', '-c', '/usr/bin/timeout 10s ' + command],
        HostConfig: {
            Binds: [`${path.resolve(`./${PREFIX}`)}:/code`],
            Memory: 32 * 1024 * 1024,
            MemorySwap: 64 * 1024 * 1024,
        },
        WorkingDir: '/code',
    });

    await container.start();
    const exitCode = await container.wait();
    await container.logs({
        follow: true,
        stdout: true,
        stderr: true
    }, (err, stream) => {
        if (err) {
            console.error('Error reading logs:', err);
            return;
        }
        container.modem.demuxStream(stream, process.stdout, process.stderr);
    });
    await container.remove();
    return exitCode.StatusCode as number;
}

/**
 * Main function to consume messages from the QUEUE_NAME
 * 
 * The function downloads the input and output test files from S3, 
 * the user's code is executed in a Docker container, and the output is compared with the expected output.
 * 
 */
async function main() {
    const conn = await amqplib.connect(QUEUE_URL);
    const ch1 = await conn.createChannel();
    await ch1.assertQueue(QUEUE_NAME);

    ch1.consume(QUEUE_NAME, async (msg) => {
        if (msg === null) {
            console.log('Consumer cancelled by server');
            return;
        }
        const data = JSON.parse(msg.content.toString());
        const code = data.code;
        const language = data.language;
        const problemId = data.problemId;

        const inputKey = `input-tests/${problemId}.txt`;
        const outputKey = `output-tests/${problemId}.txt`;

        fs.mkdirSync(path.join(__dirname, PREFIX), { recursive: true });

        const inputTestdownloadPath = path.join(__dirname, `${PREFIX}/${problemId}.in`);
        downloadFile(inputKey, inputTestdownloadPath);

        const outputTestdownloadPath = path.join(__dirname, `${PREFIX}/${problemId}.out`);
        downloadFile(outputKey, outputTestdownloadPath);

        const userOutputFilePath = path.join(__dirname, `${PREFIX}/${problemId}.user.out`);


        const ext = getExtension(language);
        const codePath = path.join(__dirname, PREFIX, `solution.${ext}`);
        fs.writeFileSync(codePath, code ?? "");

        try {
            const statusCode = await executeCodeInDocker(language, problemId);
            await handleExecutionResult(data.id, statusCode, userOutputFilePath, outputTestdownloadPath);
        } catch (err) {
            console.error(`Error processing message: ${err}`);
            await pool.sql`UPDATE submissions SET verdict = 'INTERNAL ERROR' WHERE id = ${data.id}`;
        } finally {
            await fs.rmSync(path.join(__dirname, PREFIX), { recursive: true });
            ch1.ack(msg);
        }
    });
}

async function handleExecutionResult(submissionId: number, statusCode: number, userOutputPath: string, expectedOutputPath: string) {
    if (statusCode === 124) {
        console.log('Time limit exceeded');
        await pool.sql`UPDATE submissions SET verdict = 'TIME LIMIT EXCEEDED' WHERE id = ${submissionId}`;
        return;
    }

    if (statusCode === 1) {
        console.log('Compilation error');
        await pool.sql`UPDATE submissions SET verdict = 'COMPILATION ERROR' WHERE id = ${submissionId}`;
        return;
    }

    if (statusCode === 137) {
        console.log('Memory limit exceeded');
        await pool.sql`UPDATE submissions SET verdict = 'MEMORY LIMIT EXCEEDED' WHERE id = ${submissionId}`;
        return;
    }

    const diff = spawnSync('diff', [userOutputPath, expectedOutputPath]);
    const isValid = diff.status === 0;
    console.log(isValid ? 'Correct answer' : 'Wrong answer');

    await pool.sql`UPDATE submissions SET verdict = ${isValid ? 'ACCEPTED' : 'WRONG ANSWER'} WHERE id = ${submissionId}`;
    return isValid;
}



/**
 * Build the Docker image if it does not exist.
 * 
 * The Docker image is built from the Dockerfile in the current directory
 * 
 * @returns void
 */
async function buildDockerImage() {

    const image = await docker.getImage(DOCKER_IMAGE);
    try {
        await image.inspect();
    } catch (error) {
        console.log('Building Docker image');
        await docker.buildImage(DOCKER_IMAGE, { t: DOCKER_IMAGE })
    }
}

async function createBucket() {
    const bucketParams = {
        Bucket: BUCKET_NAME,
        CreateBucketConfiguration: {
            LocationConstraint: 'us-east-1'
        }
    };

    try {
        const bucketExists = await s3.headBucket({ Bucket: BUCKET_NAME });

        if(bucketExists) {
            return;
        }
        await s3.createBucket({
            Bucket: BUCKET_NAME,
        });
    } catch (error) {
        console.error('Error creating bucket:', error);
    }
}
createBucket();
buildDockerImage();
main();