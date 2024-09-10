"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import { SubmissionsTable } from "@/db/schema";
import amqplib from "amqplib";

const queue = process.env.QUEUE_NAME!;

export async function saveSubmission(prev: any, formdata: FormData) {

    const code = formdata.get("code") as string;
    const language = formdata.get("language") as string;
    const problemId = formdata.get("problemId") as string;

    if (!code) throw new Error("Code is required");
    if (!language) throw new Error("Language is required");

    const userSession = await auth();
    console.log({ userSession });
    if (!userSession?.user) throw new Error("User not found");

    const x = await db.insert(SubmissionsTable).values({
        userId: userSession.user.id,
        code,
        language,
        problemId,
        verdict: "PENDING",
    } as any).returning();


    const conn = await amqplib.connect(process.env.QUEUE_URL!);
    const ch2 = await conn.createChannel();
    ch2.sendToQueue(queue, Buffer.from(JSON.stringify(x[0])));
    console.log({ x });
}