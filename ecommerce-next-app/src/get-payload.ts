// src/get-payload.ts

import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";
import { create } from "payload";
import type { Payload } from "payload";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Record<string, unknown>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = create({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI!,
      email: {
        transport: transporter,
        fromAddress: "hello@joshtriedcoding.com",
        fromName: "DigitalHippo",
      },
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
