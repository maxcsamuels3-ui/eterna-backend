import type { NextApiRequest, NextApiResponse } from "next";

type GenerateRequestBody = {
  prompt?: string;
};

type GenerateResponse =
  | { result: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateResponse>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }

  const body = (typeof req.body === "object" ? req.body : {}) as GenerateRequestBody;
  const prompt = body.prompt ?? "";

  res.status(200).json({ result: prompt ? `You sent: ${prompt}` : "stubbed response" });
}

