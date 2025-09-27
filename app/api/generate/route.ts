import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const b = await req.json().catch(()=>({}));
  const name = typeof b?.name === "string" ? b.name : "friend";
  return NextResponse.json({ ok: true, message: `Future you says hello, ${name}!` });
}
