import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name : "friend";

  return NextResponse.json({
    ok: true,
    message: `Future you says hello, ${name}!`,
  });
}

