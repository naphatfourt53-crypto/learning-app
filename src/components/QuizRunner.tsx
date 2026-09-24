"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion, QuizSet } from "@/data/quizzes";
import AiHelp from "@/components/AiHelp";
import MathText from "@/components/MathText";

type Mode = "before" | "after";
type Kind = "single" | "multi" | "twotier";

const KIND_LABEL: Record<Kind, string> = {
  single: "เลือก 1 ข้อ",
  multi: "เลือกทุกข้อที่ถูก",
  twotier: "2 ชั้น: ตอบ + เหตุผล",
};

function storageKey(subjectId: string, mode: Mode) {
  return `learnstep-best-${subjectId}-${mode}`;
}

function readBest(subjectId: string, mode: Mode): number {
  try {
    return Number(localStorage.getItem(storageKey(subjectId, mode)) ?? 0) || 0;
  } catch {
    return 0;
  }
}

function isCorrect(q: QuizQuestion, a: {
  single: number | null;
  multi: number[];
  tier2: number | null;
}): boolean {
  const kind: Kind = q.kind ?? "single";
  if (kind === "multi") {
    const want = [...(q.correctIndices ?? [])].sort().join(",");
    const got = [...a.multi].sort().join(",");
    return want !== "" && want === got;
  }
  if (kind === "twotier") {
    return a.single === q.correctIndex && a.tier2 === q.tier2?.correctIndex;
  }
  return a.single === q.correctIndex;
}

export default function QuizRunner({
  subjectId,
  subjectTitle,
  before,
  after,
  /** ล็อกโหมดเดียว (ใช้ฝังในโฟลว์นำเรียน) — ซ่อนปุ่มสลับโหมด */
  lockMode,
  /** แจ้งผลเมื่อทำครบชุด (ใช้โฟลว์นำเรียนเดินหน้าต่อ) */
  onFinish,
}: {
  subjectId: string;
  subjectTitle: string;
  before: QuizSet;
  after: QuizSet;
  lockMode?: Mode;
  onFinish?: (mode: Mode, percent: number) => void;
}) {
  const [mode, setMode] = useState<Mode>(lockMode ?? "before");
  const [index, setIndex] = useState(0);
  const [single, setSingle] = useState<number | null>(null);
  const [multi, setMulti] = useState<number[]>([]);
  const [tier2, setTier2] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [freeMode, setFreeMode] = useState(false);
  // อ่านคะแนนดีสุดครั้งละ 1 รอบตอน mount (lazy init แทน useEffect + try/catch กัน SSR)
  const [best, setBest] = useState<{ before: number; after: number }>(() => ({
    before: readBest(subjectId, "before"),
    after: readBest(subjectId, "after"),
  }));

  const active: QuizSet = mode === "before" ? before : after;
  const passing = active.passingScore ?? 70;
  const total = active.questions.length;
  const q = active.questions[Math.min(index, Math.max(total - 1, 0))];
  const kind: Kind = q?.kind ?? "single";
  const isBefore = mode === "before";

  const percent = useMemo(
    () => (total === 0 ? 0 : Math.round((score / total) * 100)),
    [score, total]
  );

  const afterLocked =
    !isBefore && !freeMode && best.before < (before.passingScore ?? 70);

  const resetQuestion = () => {
    setSingle(null);
    setMulti([]);
    setTier2(null);
    setAnswered(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setIndex(0);
    setScore(0);
    setFinished(false);
    resetQuestion();
  };

  const submitMulti = () => {
    if (multi.length === 0 || answered) return;
    const ok = isCorrect(q, { single: null, multi, tier2: null });
    setAnswered(true);
    if (ok) setScore((s) => s + 1);
  };

  const pickSingle = (i: number) => {
    if (answered) return;
    if (kind === "twotier") {
      if (single === null) setSingle(i);
      return;
    }
    setSingle(i);
    setAnswered(true);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };

  const pickTier2 = (i: number) => {
    if (answered || single === null) return;
    setTier2(i);
    setAnswered(true);
    if (single === q.correctIndex && i === q.tier2?.correctIndex)
      setScore((s) => s + 1);
  };

  const toggleMulti = (i: number) => {
    if (answered) return;
    setMulti((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true);
      try {
        const key = storageKey(subjectId, mode);
        const prev = readBest(subjectId, mode);
        if (percent > prev) {
          localStorage.setItem(key, String(percent));
          setBest((b) => ({ ...b, [mode]: percent }));
        }
      } catch {
        /* private mode — ข้ามการจำคะแนน */
      }
      onFinish?.(mode, percent);
    } else {
      setIndex((v) => v + 1);
      resetQuestion();
    }
  };

  const retry = () => {
    setIndex(0);
    setScore(0);
    setFinished(false);
    resetQuestion();
  };

  if (total === 0) return null;

  const correctNow =
    answered && isCorrect(q, { single, multi, tier2 });

  return (
    <div className="space-y-6">
      {/* Toggle — ซ่อนเมื่อถูกล็อกโหมดในโฟลว์นำเรียน */}
      {!lockMode && (
        <>
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
          {best.before > 0 && (
            <span className="ml-1.5 text-xs opacity-70">
              (ดีสุด {best.before}%)
            </span>
          )}
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
          {best.after > 0 && (
            <span className="ml-1.5 text-xs opacity-70">
              (ดีสุด {best.after}%)
            </span>
          )}
        </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={freeMode}
              onChange={(e) => setFreeMode(e.target.checked)}
              className="h-4 w-4 accent-slate-900"
            />
            🔓 โหมดอิสระ: ข้ามเกณฑ์ผ่าน (สำหรับทบทวน/ทดลองทำ)
          </label>
        </>
      )}

      <div>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          {active.title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {active.desc} • เกณฑ์ผ่าน {passing}%
        </p>
      </div>

      {afterLocked ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-center sm:p-8">
          <p className="text-3xl">🔒</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            After class ยังล็อกอยู่
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            {subjectTitle} กำหนดให้ผ่าน Before class ≥{" "}
            {before.passingScore ?? 70}% ก่อน (ตอนนี้ดีสุด {best.before}%)
            เพราะ After วัดของที่สอนในบทเรียน — ถ้ายังไม่แม่นพื้นฐาน
            คะแนน After จะไม่สะท้อนความรู้จริง
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
            <button
              onClick={() => switchMode("before")}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              📝 ไปทำ Before class
            </button>
            <a
              href={`/learn/${subjectId}`}
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50"
            >
              📖 กลับไปทบทวนบทเรียน
            </a>
          </div>
        </div>
      ) : !finished ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>
              ข้อ {index + 1} / {total}
            </span>
            <span className="flex items-center gap-2">
              <span className="rounded-full bg-slate-200 px-2 py-0.5">
                {KIND_LABEL[kind]}
              </span>
              <span>คะแนน {score}</span>
            </span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${
                isBefore ? "bg-sky-500" : "bg-emerald-500"
              }`}
              style={{
                width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
              }}
            />
          </div>

          {q.scenario && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {q.scenario}
            </p>
          )}
          <p className="text-[15px] font-semibold leading-relaxed text-slate-900">
            <MathText text={q.question} />
          </p>

          {/* ตัวเลือกชั้นที่ 1 */}
          <div className="mt-4 space-y-2.5">
            {q.choices.map((c, i) => {
              const letter = ["ก", "ข", "ค", "ง", "จ", "ฉ"][i] ?? i + 1;
              if (kind === "multi") {
                const checked = multi.includes(i);
                let cls = "border-slate-200 bg-white hover:border-slate-400";
                if (answered) {
                  const should = q.correctIndices?.includes(i);
                  if (should && checked)
                    cls = "border-emerald-400 bg-emerald-50";
                  else if (should) cls = "border-emerald-400 bg-emerald-50/50";
                  else if (checked) cls = "border-rose-400 bg-rose-50";
                  else cls = "border-slate-200 bg-white opacity-60";
                } else if (checked) {
                  cls = "border-sky-500 bg-sky-50";
                }
                return (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed text-slate-800 transition ${cls}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={answered}
                      onChange={() => toggleMulti(i)}
                      className="mt-1 h-4 w-4 accent-sky-600"
                    />
                    <span>
                      <span className="mr-2 font-bold text-slate-500">
                        {letter}.
                      </span>
                      <MathText text={c} />
                    </span>
                  </label>
                );
              }
              const isPicked = single === i;
              let cls =
                "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50";
              if (answered) {
                if (kind === "twotier") {
                  cls = isPicked
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white opacity-60";
                } else if (i === q.correctIndex) {
                  cls = "border-emerald-400 bg-emerald-50";
                } else if (isPicked) {
                  cls = "border-rose-400 bg-rose-50";
                } else {
                  cls = "border-slate-200 bg-white opacity-60";
                }
              } else if (isPicked && kind === "twotier") {
                cls = "border-sky-500 bg-sky-50";
              }
              return (
                <button
                  key={i}
                  onClick={() => pickSingle(i)}
                  disabled={answered || (kind === "twotier" && single !== null)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm leading-relaxed text-slate-800 transition ${cls}`}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {letter}
                  </span>
                  <MathText text={c} />
                </button>
              );
            })}
          </div>

          {/* ชั้นที่ 2 (twotier) */}
          {kind === "twotier" && single !== null && q.tier2 && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/60 p-4">
              <p className="text-sm font-bold text-sky-900">
                ชั้นที่ 2 — เลือกเหตุผลประกอบคำตอบ:
              </p>
              <p className="mt-1 text-sm text-slate-700">
                <MathText text={q.tier2.question} />
              </p>
              <div className="mt-3 space-y-2.5">
                {q.tier2.choices.map((c, i) => {
                  const isPicked = tier2 === i;
                  let cls =
                    "border-slate-300 bg-white hover:border-sky-400 hover:bg-white";
                  if (answered) {
                    if (i === q.tier2?.correctIndex)
                      cls = "border-emerald-400 bg-emerald-50";
                    else if (isPicked)
                      cls = "border-rose-400 bg-rose-50";
                    else cls = "border-slate-200 bg-white opacity-60";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => pickTier2(i)}
                      disabled={answered}
                      className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm leading-relaxed text-slate-800 transition ${cls}`}
                    >
                      <span className="mr-2 font-bold text-slate-500">
                        {["ก", "ข", "ค", "ง"][i]}.
                      </span>
                      <MathText text={c} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {kind === "multi" && !answered && (
            <button
              onClick={submitMulti}
              disabled={multi.length === 0}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-40 sm:w-auto sm:px-8"
            >
              ตรวจคำตอบ ({multi.length} ข้อที่เลือก)
            </button>
          )}

          {/* AI ช่วยใบ้/อธิบายเพิ่ม (คีย์ของผู้ใช้เอง) */}
          <AiHelp question={q} answered={answered} />

          {answered && (
            <div className="mt-4 space-y-2.5">
              <div
                className={`rounded-xl p-4 text-sm leading-relaxed ${
                  correctNow
                    ? "bg-emerald-100/70 text-emerald-900"
                    : "bg-rose-100/70 text-rose-900"
                }`}
              >
                <p className="font-bold">
                  {correctNow
                    ? "✅ ถูกต้องทั้งคำตอบและเหตุผล"
                    : kind === "twotier"
                      ? "❌ ยังไม่ถูก (ต้องถูกทั้ง 2 ชั้นถึงจะได้คะแนน)"
                      : kind === "multi"
                        ? "❌ ยังไม่ถูก (ต้องเลือกให้ครบทุกข้อที่ถูก และไม่เลือกข้อผิด)"
                        : "❌ ยังไม่ถูก"}
                </p>
                <p className="mt-1">
                  <MathText text={q.explanation} />
                </p>
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
            {isBefore ? "ผล Before class" : "ผล After class"} • เกณฑ์ผ่าน{" "}
            {passing}%
          </p>
          <p
            className={`mt-2 text-5xl font-extrabold ${
              percent >= passing
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
            {percent >= passing
              ? isBefore
                ? " — ผ่านเกณฑ์! ปลดล็อก After class แล้ว 🎉"
                : " — ผ่านเกณฑ์! เก่งมาก 🎉"
              : " — ยังไม่ผ่านเกณฑ์ กลับไปทบทวนบทเรียนแล้วลองใหม่ 📚"}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
            {percent < passing ? (
              <a
                href={`/learn/${subjectId}`}
                className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
              >
                📖 กลับไปฝึกบทเดิมก่อน
              </a>
            ) : (
              isBefore && (
                <button
                  onClick={() => switchMode("after")}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  ไปทำ After class →
                </button>
              )
            )}
            <button
              onClick={retry}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              🔁 ทำใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
