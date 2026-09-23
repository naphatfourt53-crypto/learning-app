"use client";

import { useEffect, useState } from "react";
import type { QuizQuestion } from "@/data/quizzes";

export interface PracticeItem {
  subjectTitle: string;
  mode: "before" | "after";
  question: QuizQuestion;
}

export interface PracticeConfig {
  purpose: string;
  showExplanations: "now" | "end";
  passing: number;
  timedSeconds: number | null;
}

function correct(
  q: QuizQuestion,
  a: { single: number | null; multi: number[]; tier2: number | null }
): boolean {
  const kind = q.kind ?? "single";
  if (kind === "multi") {
    return (
      [...(q.correctIndices ?? [])].sort().join(",") ===
        [...a.multi].sort().join(",") && a.multi.length > 0
    );
  }
  if (kind === "twotier") {
    return a.single === q.correctIndex && a.tier2 === q.tier2?.correctIndex;
  }
  return a.single === q.correctIndex;
}

/** รันเนอร์สำหรับชุดฝึกแบบกำหนดเอง (ไม่มี gate, มีจับเวลา, เฉลยตามตั้งค่า) */
export default function PracticeRunner({
  items,
  config,
  onExit,
}: {
  items: PracticeItem[];
  config: PracticeConfig;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [single, setSingle] = useState<number | null>(null);
  const [multi, setMulti] = useState<number[]>([]);
  const [tier2, setTier2] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    config.timedSeconds
  );

  const total = items.length;
  const item = items[Math.min(index, total - 1)];
  const q = item.question;
  const kind = q.kind ?? "single";
  const showNow = config.showExplanations === "now";

  useEffect(() => {
    if (config.timedSeconds === null) return;
    if (finished) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null) return null;
        if (s <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [config.timedSeconds, finished]);

  if (total === 0) return null;

  const submit = (a: { single: number | null; multi: number[]; tier2: number | null }) => {
    const ok = correct(q, a);
    setAnswered(true);
    setResults((r) => [...r, ok]);
  };

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((v) => v + 1);
      setSingle(null);
      setMulti([]);
      setTier2(null);
      setAnswered(false);
    }
  };

  const score = results.filter(Boolean).length;
  const percent = Math.round((score / total) * 100);
  const okNow = answered && correct(q, { single, multi, tier2 });

  const mm = secondsLeft !== null ? Math.floor(secondsLeft / 60) : 0;
  const ss = secondsLeft !== null ? secondsLeft % 60 : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">
          {config.purpose} • ข้อ {finished ? total : index + 1}/{total} • ถูก{" "}
          {score}
        </p>
        {secondsLeft !== null && !finished && (
          <p
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              secondsLeft < 60
                ? "bg-rose-100 text-rose-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            ⏱ {mm}:{String(ss).padStart(2, "0")}
          </p>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${((index + (answered || finished ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {!finished ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
          <p className="mb-1 text-xs text-slate-400">
            {item.subjectTitle} • {item.mode === "before" ? "Before" : "After"}
          </p>
          {q.scenario && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {q.scenario}
            </p>
          )}
          <p className="text-[15px] font-semibold text-slate-900">{q.question}</p>

          <div className="mt-4 space-y-2.5">
            {q.choices.map((c, i) => {
              const letter = ["ก", "ข", "ค", "ง", "จ", "ฉ"][i] ?? i + 1;
              if (kind === "multi") {
                const checked = multi.includes(i);
                return (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm text-slate-800 ${
                      answered
                        ? q.correctIndices?.includes(i)
                          ? "border-emerald-400 bg-emerald-50"
                          : checked
                            ? "border-rose-400 bg-rose-50"
                            : "border-slate-200 bg-white opacity-60"
                        : checked
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={answered}
                      onChange={() =>
                        setMulti((p) =>
                          p.includes(i) ? p.filter((x) => x !== i) : [...p, i]
                        )
                      }
                      className="mt-1 h-4 w-4 accent-violet-600"
                    />
                    <span>
                      <span className="mr-2 font-bold text-slate-500">{letter}.</span>
                      {c}
                    </span>
                  </label>
                );
              }
              return (
                <button
                  key={i}
                  disabled={answered || (kind === "twotier" && single !== null)}
                  onClick={() => {
                    if (kind === "twotier") {
                      if (single === null) setSingle(i);
                    } else {
                      setSingle(i);
                      submit({ single: i, multi: [], tier2: null });
                    }
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm text-slate-800 ${
                    answered
                      ? kind === "twotier"
                        ? single === i
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 bg-white opacity-60"
                        : i === q.correctIndex
                          ? "border-emerald-400 bg-emerald-50"
                          : single === i
                            ? "border-rose-400 bg-rose-50"
                            : "border-slate-200 bg-white opacity-60"
                      : single === i
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <span className="mr-2 font-bold text-slate-500">{letter}.</span>
                  {c}
                </button>
              );
            })}
          </div>

          {kind === "twotier" && single !== null && q.tier2 && (
            <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <p className="text-sm font-bold text-violet-900">
                ชั้นที่ 2 — {q.tier2.question}
              </p>
              <div className="mt-3 space-y-2.5">
                {q.tier2.choices.map((c, i) => (
                  <button
                    key={i}
                    disabled={answered}
                    onClick={() => {
                      setTier2(i);
                      submit({ single, multi: [], tier2: i });
                    }}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm text-slate-800 ${
                      answered
                        ? i === q.tier2?.correctIndex
                          ? "border-emerald-400 bg-emerald-50"
                          : tier2 === i
                            ? "border-rose-400 bg-rose-50"
                            : "border-slate-200 bg-white opacity-60"
                        : "border-slate-300 bg-white hover:border-violet-400"
                    }`}
                  >
                    <span className="mr-2 font-bold text-slate-500">
                      {["ก", "ข", "ค", "ง"][i]}.
                    </span>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {kind === "multi" && !answered && (
            <button
              onClick={() => submit({ single: null, multi, tier2: null })}
              disabled={multi.length === 0}
              className="mt-4 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              ตรวจคำตอบ
            </button>
          )}

          {answered && showNow && (
            <div className="mt-4 space-y-2.5">
              <div
                className={`rounded-xl p-4 text-sm ${
                  okNow
                    ? "bg-emerald-100/70 text-emerald-900"
                    : "bg-rose-100/70 text-rose-900"
                }`}
              >
                <p className="font-bold">{okNow ? "✅ ถูกต้อง" : "❌ ยังไม่ถูก"}</p>
                <p className="mt-1">{q.explanation}</p>
              </div>
              <button
                onClick={next}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white sm:w-auto sm:px-8"
              >
                {index + 1 >= total ? "ดูผล →" : "ข้อต่อไป →"}
              </button>
            </div>
          )}
          {answered && !showNow && (
            <button
              onClick={next}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white sm:w-auto sm:px-8"
            >
              {index + 1 >= total ? "ดูผล →" : "ข้อต่อไป →"}
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 text-center sm:p-8">
          <p className="text-sm text-slate-500">
            ผลชุดฝึก • {config.purpose} • เกณฑ์ {config.passing}%
          </p>
          <p
            className={`mt-2 text-5xl font-extrabold ${
              percent >= config.passing ? "text-emerald-600" : "text-amber-500"
            }`}
          >
            {percent}%
          </p>
          <p className="mt-2 text-sm text-slate-600">
            ถูก {score} จาก {total} ข้อ
            {percent >= config.passing ? " — ผ่านเกณฑ์ 🎉" : " — ยังไม่ผ่าน ลองใหม่อีกครั้ง 💪"}
          </p>
          {!showNow && (
            <div className="mx-auto mt-5 max-w-2xl space-y-2.5 text-left">
              <p className="text-sm font-bold text-slate-800">เฉลยทุกข้อ:</p>
              {items.map((it, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3.5 text-sm ${
                    results[i]
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-rose-200 bg-rose-50/60"
                  }`}
                >
                  <p className="font-semibold text-slate-900">
                    {results[i] ? "✅" : "❌"} {it.question.question}
                  </p>
                  <p className="mt-1 text-slate-600">{it.question.explanation}</p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={onExit}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            ← สร้างชุดใหม่
          </button>
        </div>
      )}
    </div>
  );
}
