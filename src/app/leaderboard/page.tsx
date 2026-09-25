"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderMenu from "@/components/HeaderMenu";
import { ALL_SUBJECTS } from "@/data/curriculum";
import {
  loadBoard,
  readStreak,
  type BoardEntry,
} from "@/lib/scores";

/** หน้า Leaderboard: ท็อป 10 รายวิชา + streak ของตัวเอง */
export default function LeaderboardPage() {
  const [subjectId, setSubjectId] = useState("math-m1");
  const [board, setBoard] = useState<{
    configured: boolean;
    before: BoardEntry[];
    after: BoardEntry[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const b = await loadBoard(subjectId);
      if (!cancelled) {
        setBoard(b);
        setStreak(readStreak());
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  const renderRows = (rows: BoardEntry[], color: string) =>
    rows.length === 0 ? (
      <p className="p-4 text-center text-sm text-slate-400">
        ยังไม่มีคะแนน — เป็นคนแรกเลย!
      </p>
    ) : (
      <ol className="divide-y divide-slate-100">
        {rows.map((r, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-2.5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i === 0
                  ? "bg-amber-100 text-amber-700"
                  : i === 1
                    ? "bg-slate-200 text-slate-700"
                    : i === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-500"
              }`}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
              {r.name}
            </span>
            <span className={`text-sm font-extrabold ${color}`}>{r.score}%</span>
          </li>
        ))}
      </ol>
    );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              🏆
            </span>
            <p className="truncate text-sm font-bold text-slate-900">กระดานผู้นำ</p>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              ← หน้าหลัก
            </Link>
            <HeaderMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900">
            🏆 Leaderboard + Streak 🔥
          </h1>
          <div className="w-fit rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
            🔥 เรียนต่อเนื่อง {streak} วัน
          </div>
        </div>

        <label className="mt-4 block text-sm font-semibold text-slate-700">
          เลือกวิชา
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
          >
            {ALL_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>

        {loading ? (
          <p className="mt-6 text-center text-sm text-slate-400">กำลังโหลด…</p>
        ) : board && !board.configured ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-sm font-bold text-slate-800">
              บอร์ดกลางยังไม่เปิด (ต้องตั้งค่า Upstash Redis บนเซิร์ฟเวอร์ก่อน)
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-500">
              ตอนนี้คะแนนดีสุด + streak เก็บในเบราว์เซอร์เครื่องนี้ให้อยู่แล้ว
              วิธีเปิดบอร์ดกลางดูใน README หัวข้อ “Leaderboard (Upstash Redis)”
            </p>
          </div>
        ) : (
          board && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-sky-700">
                  📝 Before ดีสุด
                </p>
                {renderRows(board.before, "text-sky-700")}
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-emerald-700">
                  ✅ After ดีสุด
                </p>
                {renderRows(board.after, "text-emerald-600")}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
