"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ALL_SUBJECTS } from "@/data/curriculum";
import { getQuiz } from "@/data/quizzes";

type Tab = "before" | "after";

function readBest(subjectId: string, mode: string): number {
  try {
    return Number(localStorage.getItem(`learnstep-best-${subjectId}-${mode}`) ?? 0) || 0;
  } catch {
    return 0;
  }
}

// วิชาแนะนำหน้าแรก (ของจริงจากคลัง ไม่ใช่ mock)
const FEATURED = ["math-m1", "sci-m1", "eng-ms"];

export default function QuizSection() {
  const [tab, setTab] = useState<Tab>("before");
  const { data: session } = useSession();
  const isBefore = tab === "before";

  const cards = FEATURED.map((id) => ALL_SUBJECTS.find((s) => s.id === id)!).filter(Boolean);

  const bests = cards.map((s) => ({
    id: s.id,
    before: readBest(s.id, "before"),
    after: readBest(s.id, "after"),
  }));
  const avg = (k: "before" | "after") => {
    const vals = bests.map((b) => b[k]).filter((v) => v > 0);
    if (vals.length === 0) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };
  const avgBefore = avg("before");
  const avgAfter = avg("after");

  const name = session?.user?.name ?? session?.user?.email ?? "ผู้เยี่ยมชม";
  const initial = name.trim().charAt(0).toUpperCase() || "G";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white sm:p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
            03 — แบบทดสอบ / ประเมินผล
          </p>
          <h2 className="mt-1.5 text-xl font-bold sm:text-2xl">
            วัดผลก่อนและหลังเรียน
          </h2>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-300">
            ทำ Before class เพื่อเช็กพื้นฐาน แล้วกลับมาทำ After class
            เพื่อดูพัฒนาการของตัวเอง
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 pr-5 backdrop-blur sm:p-4 sm:pr-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-lg font-bold">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="text-xs text-slate-300">
              {session?.user ? "สมาชิก • สะสมคะแนนได้" : "โหมดผู้เยี่ยมชม • login เพื่อสะสม"}
            </p>
            <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${avgAfter ?? avgBefore ?? 0}%` }}
              />
            </div>
          </div>
          <span className="ml-2 shrink-0 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
            {avgAfter !== null ? `${avgAfter}%` : "เริ่มเลย"}
          </span>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="เลือกแบบทดสอบ"
            className="inline-flex w-full rounded-full border border-slate-200 bg-slate-100 p-1.5 sm:w-auto"
          >
            <button
              role="tab"
              aria-selected={isBefore}
              onClick={() => setTab("before")}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-8 ${
                isBefore
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📝 Before class
            </button>
            <button
              role="tab"
              aria-selected={!isBefore}
              onClick={() => setTab("after")}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-8 ${
                !isBefore
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ✅ After class
            </button>
          </div>
          <Link
            href="/quiz"
            className="text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            ดูทั้งหมด 25 วิชา →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((s) => {
            const q = getQuiz(s.id);
            const n = isBefore
              ? (q?.before.questions.length ?? 0)
              : (q?.after.questions.length ?? 0);
            const best = isBefore ? readBest(s.id, "before") : readBest(s.id, "after");
            return (
              <div
                key={`${tab}-${s.id}`}
                className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <span
                  className={`mb-3 w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isBefore
                      ? "bg-sky-100 text-sky-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {isBefore ? "BEFORE" : "AFTER"} • {s.level.split(" ")[0]}
                  {best > 0 && ` • ดีสุด ${best}%`}
                </span>
                <h3 className="text-[15px] font-semibold leading-snug text-slate-900">
                  {isBefore ? "Pre-test" : "Post-test"}: {s.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {n} ข้อ • ⏱ ประมาณ {Math.max(5, Math.round(n * 1.2))} นาที
                </p>
                <Link
                  href={`/quiz/${s.id}`}
                  className={`mt-5 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                    isBefore
                      ? "bg-slate-900 text-white hover:bg-sky-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {best > 0 ? "ทำอีกครั้ง →" : "เริ่มทำแบบทดสอบ →"}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 sm:p-5">
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Before เฉลี่ย (ของจริง)</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {avgBefore !== null ? `${avgBefore}%` : "—"}
            </p>
          </div>
          <div className="border-t border-slate-200 pt-3 text-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">After ล่าสุด (ของจริง)</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {avgAfter !== null ? `${avgAfter}%` : "—"}
            </p>
          </div>
          <div className="border-t border-slate-200 pt-3 text-center sm:border-l sm:border-t-0 sm:pl-5 sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">พัฒนาการ</p>
            <p className="mt-1 text-2xl font-bold text-sky-600">
              {avgBefore !== null && avgAfter !== null
                ? `+${avgAfter - avgBefore}%`
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
