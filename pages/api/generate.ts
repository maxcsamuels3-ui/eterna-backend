import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ output: "Method not allowed" });

  const prompt = (req.body && (req.body as any).prompt) || "";
  if (!prompt) return res.status(200).json({ output: "Missing prompt (type something then click Generate)" });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({ output: "Missing OPENAI_API_KEY in .env.local (and in Vercel for prod)" });
  }

  try {
    const r1 = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const text1 = await r1.text();

    if (r1.ok) {
      try {
        const data = JSON.parse(text1);
        const out =
          data?.choices?.[0]?.message?.content ??
          (Array.isArray(data?.choices?.[0]?.message?.content)
            ? data.choices[0].message.content.map((p: any) => p?.text || p).join("")
            : null);
        if (out && String(out).trim()) return res.status(200).json({ output: out });
      } catch {
        // Fall through if JSON parse fails
      }
      return res.status(200).json({ output: `Unexpected success format:\n${text1.slice(0, 500)}` });
    } else {
      return res.status(200).json({
        output: `OpenAI error (status ${r1.status}):\n${text1.slice(0, 500)}`,
      });
    }
  } catch (e: any) {
    return res.status(200).json({
      output: `Request crashed: ${e?.message || String(e)}`,
    });
  }
}
