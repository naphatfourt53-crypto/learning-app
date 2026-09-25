import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { auth } from "@/auth";

function client() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return Redis.fromEnv();
}

/**
 * POST /api/scores { subjectId, mode, percent, name? }
 * เก็บคะแนนดีสุดลงลีดเดอร์บอร์ดกลาง (Upstash Redis)
 * ถ้ายังไม่ตั้งค่า env จะตอบ configured:false ให้ client ข้ามไปเงียบๆ
 */
export async function POST(req: Request) {
  const redis = client();
  if (!redis) {
    return NextResponse.json({ ok: false, configured: false });
  }
  let body: { subjectId?: string; mode?: string; percent?: number; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  const { subjectId, mode, percent } = body;
  if (!subjectId || (mode !== "before" && mode !== "after") || typeof percent !== "number") {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const session = await auth().catch(() => null);
  const email = session?.user?.email ?? null;
  const anon = `anon:${(body as { anonId?: string }).anonId ?? "unknown"}`;
  const userKey = email ?? anon;
  const name = session?.user?.name ?? body.name ?? "นักเรียน";

  const boardKey = `board:${subjectId}:${mode}`;
  // เก็บเฉพาะคะแนนสูงสุดของแต่ละคน
  await redis.zadd(boardKey, { gt: true }, { score: percent, member: userKey });
  await redis.hset("board:names", { [userKey]: name.slice(0, 40) });
  const today = new Date().toISOString().slice(0, 10);
  await redis.sadd(`days:${userKey}`, today);

  return NextResponse.json({ ok: true });
}

/** GET /api/scores?subject=ID → ท็อป 10 before/after ของวิชานั้น */
export async function GET(req: Request) {
  const redis = client();
  if (!redis) {
    return NextResponse.json({ ok: false, configured: false });
  }
  const subjectId = new URL(req.url).searchParams.get("subject") ?? "";
  if (!subjectId) {
    return NextResponse.json({ ok: false, error: "missing subject" }, { status: 400 });
  }
  const [beforeRaw, afterRaw, names] = await Promise.all([
    redis.zrange(`board:${subjectId}:before`, 0, 9, { rev: true, withScores: true }),
    redis.zrange(`board:${subjectId}:after`, 0, 9, { rev: true, withScores: true }),
    redis.hgetall<Record<string, string>>("board:names"),
  ]);
  const before = beforeRaw as (string | number)[];
  const after = afterRaw as (string | number)[];
  const map = (arr: (string | number)[]) => {
    const out: { name: string; score: number }[] = [];
    for (let i = 0; i < arr.length; i += 2) {
      const member = String(arr[i]);
      out.push({
        name: names?.[member] ?? (member.startsWith("anon:") ? "นักเรียน" : member),
        score: Number(arr[i + 1]),
      });
    }
    return out;
  };
  return NextResponse.json({ ok: true, before: map(before), after: map(after) });
}
