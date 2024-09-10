"use server";

import { db } from "@/db/db";
import { ProblemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Readable } from "stream";


const BUCKET_NAME = process.env.BUCKET_NAME!;
const BUCKET_URL = process.env.BUCKET_URL!;

const s3Client = new S3({
    endpoint: BUCKET_URL,
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.BUCKET_USER!,
        secretAccessKey: process.env.BUCKET_PASSWORD!,
    },
    forcePathStyle: true, // needed with MinIO
});

async function uploadFileToS3(bucketName: string, key: string, file: File) {
    const Body = (await file.arrayBuffer()) as Buffer;
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: Body,
        ContentType: file.type,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log(`File uploaded successfully: ${key}`);
        return `${BUCKET_URL}/${bucketName}/${key}`;
    } catch (err) {
        console.log("Error", err);
        throw new Error("Failed to upload file to S3");
    }
}

export async function saveOrEditProblem(prev: any, formdata: FormData) {
    let id = formdata.get("id") as string;
    const title = formdata.get("title") as string;
    const description = formdata.get("description") as string;
    const sampleTestCaseInput = formdata.get("sampleTestCaseInput") as string;
    const sampleTestCaseOutput = formdata.get("sampleTestCaseOutput") as string;
    const explaination = formdata.get("explaination") as string;
    const timeLimit = formdata.get("timeLimit") as string;
    const memoryLimit = formdata.get("memoryLimit") as string;
    const inputTests = formdata.get("inputTests") as File;
    const outputTests = formdata.get("outputTests") as File;

    if (!title) throw new Error("Title is required");


    if (id) {
        await db.update(ProblemsTable).set({
            title,
            description,
            sampleTestCaseInput,
            sampleTestCaseOutput,
            explaination,
            timeLimit,
            memoryLimit,
        }).where(eq(ProblemsTable.id, parseInt(id)));
    } else {
        const prob = await db.insert(ProblemsTable).values({
            title,
            description,
            sampleTestCaseInput,
            sampleTestCaseOutput,
            explaination,
            timeLimit,
            memoryLimit,
        }).returning();
        id = prob[0].id.toString();
    }

    // Upload files to S3
    const inputTestUrl = await uploadFileToS3(BUCKET_NAME, `input-tests/${id}.txt`, inputTests);
    const outputTestUrl = await uploadFileToS3(BUCKET_NAME, `output-tests/${id}.txt`, outputTests);

    console.log("inputTestUrl", inputTestUrl);
    console.log("outputTestUrl", outputTestUrl);
}
