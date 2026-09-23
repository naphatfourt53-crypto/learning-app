"use client";

import { useMemo, useState } from "react";
import type { QuizSet } from "@/data/quizzes";

type Mode = "before" | "after";

export default function QuizRunner({
  before,
  after,
}: {
  before: QuizSet;
  after: QuizSet;
}) {
  const [mode, setMode] = useState<Mode>("before");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const active: QuizSet = mode === "before" ? before : after;
  const q = active.questions[index];
  const total = active.questions.length;
  const isBefore = mode === "before";

  const percent = useMemo(
    () => (total === 0 ? 0 : Math.round((score / total) * 100)),
    [score, total]
  );

  const switchMode = (m: Mode) => {
    setMode(m);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((v) => v + 1);
      setPicked(null);
    }
  };

  const retry = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (total === 0) return null;

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div
        role="tablist"
        aria-label="เลือกแบบทดสอบ"
        className="inline-flex w-full rounded-full border border-slate-200 bg-slate-100 p-1.5 sm:w-auto"
      >
        <button
          role="tab"
          aria-selected={isBefore}
          onClick={() => switchMode("before")}
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
          onClick={() => switchMode("after")}
          className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-8 ${
            !isBefore
              ? "bg-emerald-600 text-white shadow-md"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ✅ After class
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          {active.title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{active.desc}</p>
      </div>

      {!finished ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
          {/* progress */}
          <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>
              ข้อ {index + 1} / {total}
            </span>
            <span>คะแนน {score}</span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${
                isBefore ? "bg-sky-500" : "bg-emerald-500"
              }`}
              style={{ width: `${((index + (picked !== null ? 1 : 0)) / total) * 100}%` }}
            />
          </div>

          {q.scenario && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {q.scenario}
            </p>
          )}
          <p className="text-[15px] font-semibold leading-relaxed text-slate-900">
            {q.question}
          </p>

          <div className="mt-4 space-y-2.5">
            {q.choices.map((c, i) => {
              const isCorrect = i === q.correctIndex;
              const isPicked = i === picked;
              let cls =
                "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50";
              if (picked !== null) {
                if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
                else if (isPicked) cls = "border-rose-400 bg-rose-50";
                else cls = "border-slate-200 bg-white opacity-60";
              }
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={picked !== null}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm leading-relaxed text-slate-800 transition ${cls}`}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {["ก", "ข", "ค", "ง"][i] ?? i + 1}
                  </span>
                  {c}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-4 space-y-2.5">
              <div
                className={`rounded-xl p-4 text-sm leading-relaxed ${
                  picked === q.correctIndex
                    ? "bg-emerald-100/70 text-emerald-900"
                    : "bg-rose-100/70 text-rose-900"
                }`}
              >
                <p className="font-bold">
                  {picked === q.correctIndex ? "✅ ถูกต้อง" : "❌ ยังไม่ถูก"}
                </p>
                <p className="mt-1">{q.explanation}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                <p className="font-bold">💡 จุดที่มักเข้าใจผิด</p>
                <p className="mt-1">{q.misconception}</p>
              </div>
              <button
                onClick={next}
                className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto sm:px-8 ${
                  isBefore
                    ? "bg-slate-900 hover:bg-sky-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {index + 1 >= total ? "ดูผลคะแนน →" : "ข้อต่อไป →"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 text-center sm:p-8">
          <p className="text-sm font-medium text-slate-500">
            {isBefore ? "ผล Before class" : "ผล After class"}
          </p>
          <p
            className={`mt-2 text-5xl font-extrabold ${
              percent >= 70
                ? "text-emerald-600"
                : percent >= 40
                  ? "text-amber-500"
                  : "text-rose-500"
            }`}
          >
            {percent}%
          </p>
          <p className="mt-2 text-sm text-slate-600">
            ตอบถูก {score} จาก {total} ข้อ
            {percent >= 70
              ? " — เยี่ยมมาก พร้อมไปต่อ! 🎉"
              : percent >= 40
                ? " — พอใช้ได้ กลับไปทบทวนบทเรียนแล้วลองใหม่ 💪"
                : " — แนะนำให้อ่านบทเรียนก่อนแล้วกลับมาลองใหม่ 📚"}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
            <button
              onClick={retry}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              🔁 ทำใหม่
            </button>
            <button
              onClick={() => switchMode(isBefore ? "after" : "before")}
              className="rounded-xl bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200"
            >
              สลับไป {isBefore ? "After class" : "Before class"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
