"use client";

import { useState } from "react";
import Link from "next/link";
import type { Subject } from "@/data/curriculum";
import type { SubjectQuiz } from "@/data/quizzes";
import QuizRunner from "@/components/QuizRunner";
import LessonView from "@/components/LessonView";

type Step = "start" | "before" | "study" | "after" | "done";

interface FlowState {
  everBefore: boolean;
  beforeBest: number;
  studied: boolean;
  afterBest: number;
  completed: boolean;
}

function key(id: string) {
  return `learnstep-flow-${id}`;
}

function readFlow(id: string): FlowState {
  const fallback: FlowState = {
    everBefore: false,
    beforeBest: 0,
    studied: false,
    afterBest: 0,
    completed: false,
  };
  try {
    const raw = localStorage.getItem(key(id));
    if (raw) return { ...fallback, ...(JSON.parse(raw) as Partial<FlowState>) };
  } catch {
    /* ใช้ค่าเริ่มต้น */
  }
  return fallback;
}

function writeFlow(id: string, s: FlowState) {
  try {
    localStorage.setItem(key(id), JSON.stringify(s));
  } catch {
    /* private mode */
  }
}

const STEPS: { id: Step; label: string }[] = [
  { id: "start", label: "เริ่ม" },
  { id: "before", label: "สอบก่อนเรียน" },
  { id: "study", label: "เรียน" },
  { id: "after", label: "สอบหลังเรียน" },
  { id: "done", label: "จบบท" },
];

/**
 * โฟลว์นำเรียนรายวิชา:
 * เริ่ม (เลือก: ทำเลย/เรียนก่อน — ครั้งแรกบังคับสอบก่อน)
 * → Before → เรียน → After → จบบท
 */
export default function StudyFlow({
  subject,
  quiz,
}: {
  subject: Subject;
  quiz: SubjectQuiz;
}) {
  const [saved] = useState<FlowState>(() => readFlow(subject.id));
  const [flow, setFlow] = useState<FlowState>(saved);
  const [step, setStep] = useState<Step>("start");

  const passing = quiz.before.passingScore ?? 70;
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const update = (patch: Partial<FlowState>) => {
    setFlow((f) => {
      const next = { ...f, ...patch };
      writeFlow(subject.id, next);
      return next;
    });
  };

  const goStudy = () => {
    update({ studied: true });
    setStep("study");
  };

  return (
    <div className="space-y-5">
      {/* Stepper */}
      <ol className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-2 sm:p-4">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-1 sm:gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-emerald-500 text-white"
                    : current
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-xs font-semibold ${
                  current ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="mx-1 h-px flex-1 bg-slate-200" />
              )}
            </li>
          );
        })}
      </ol>

      {step === "start" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            {subject.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {flow.everBefore
              ? "เลือกได้เลย: จะทำข้อสอบก่อนเรียนทันที หรือขอทบทวนพื้นฐานก่อนก็ได้"
              : `ครั้งแรกที่เรียนวิชานี้ต้องสอบก่อนเรียนก่อน (วัดพื้นฐานดิบๆ) — ผ่านเกณฑ์ ${passing}% แล้วค่อยไปต่อ`}
          </p>
          {flow.completed && (
            <p className="mx-auto mt-2 w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ✅ เคยจบบทนี้แล้ว (Before ดีสุด {flow.beforeBest}% • After ดีสุด{" "}
              {flow.afterBest}%)
            </p>
          )}
          <div className="mx-auto mt-5 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => setStep("before")}
              className="rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 text-white transition hover:bg-slate-700"
            >
              <p className="text-2xl">📝</p>
              <p className="mt-1 font-bold">ทำ Before เลย</p>
              <p className="mt-1 text-xs text-slate-300">
                {quiz.before.questions.length} ข้อ • เกณฑ์ {passing}%
              </p>
            </button>
            <button
              onClick={goStudy}
              disabled={!flow.everBefore}
              className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-5 text-slate-900 transition hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <p className="text-2xl">📖</p>
              <p className="mt-1 font-bold">ขอเรียนพื้นฐานก่อน</p>
              <p className="mt-1 text-xs text-slate-500">
                {flow.everBefore
                  ? "ทบทวนบทเรียนก่อนสอบ"
                  : "🔒 ครั้งแรกต้องสอบก่อนเรียนก่อน"}
              </p>
            </button>
          </div>
        </div>
      )}

      {step === "before" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <QuizRunner
            subjectId={subject.id}
            subjectTitle={subject.title}
            before={quiz.before}
            after={quiz.after}
            lockMode="before"
            onFinish={(_m, percent) => {
              update({
                everBefore: true,
                beforeBest: Math.max(flow.beforeBest, percent),
              });
            }}
          />
          <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-4 sm:flex-row">
            <button
              onClick={goStudy}
              className="flex-1 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              📖 ไปเรียนบทนี้ →
            </button>
            <p className="self-center text-xs text-slate-400">
              สอบเสร็จแล้วไปเรียนต่อได้เลย (ผ่าน/ไม่ผ่านก็เรียนได้)
            </p>
          </div>
        </div>
      )}

      {step === "study" && (
        <div className="space-y-5">
          <LessonView lessons={subject.lessons} subjectId={subject.id} />
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={() => setStep("after")}
              className="flex-1 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              ✅ ไปสอบหลังเรียน →
            </button>
          </div>
          {flow.beforeBest < passing && (
            <p className="rounded-xl bg-amber-50 p-3.5 text-center text-xs leading-relaxed text-amber-800">
              หมายเหตุ: Before ดีสุด {flow.beforeBest}% ยังไม่ถึงเกณฑ์{" "}
              {passing}% — แนะนำให้ย้อนกลับไปทำ Before ให้ผ่านก่อน
              จะได้วัดพัฒนาการได้จริง (หรือ
              <button
                onClick={() => setStep("before")}
                className="font-bold underline"
              >
                กลับไปสอบ Before
              </button>
              )
            </p>
          )}
        </div>
      )}

      {step === "after" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <QuizRunner
            subjectId={subject.id}
            subjectTitle={subject.title}
            before={quiz.before}
            after={quiz.after}
            lockMode="after"
            onFinish={(_m, percent) => {
              update({
                afterBest: Math.max(flow.afterBest, percent),
                completed: percent >= (quiz.after.passingScore ?? 70),
              });
              setStep("done");
            }}
          />
          </div>
          <Link
            href={`/practice?subjects=${subject.id}`}
            className="block rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center text-sm font-semibold text-violet-800 hover:bg-violet-100"
          >
            🎯 อยากซ้อมเพิ่ม? สร้างข้อสอบย่อยบทนี้เอง (เลือกจำนวน/ระดับ/จับเวลาได้)
          </Link>
        </div>
      )}

      {step === "done" && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center shadow-sm sm:p-10">
          <p className="text-4xl">🎓</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            จบบท {subject.title} แล้ว!
          </h2>
          <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">Before ดีสุด</p>
              <p className="text-2xl font-extrabold text-sky-700">
                {flow.beforeBest}%
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-slate-500">After ดีสุด</p>
              <p className="text-2xl font-extrabold text-emerald-600">
                {flow.afterBest}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            พัฒนาการ:{" "}
            <span className="font-bold text-emerald-700">
              {flow.afterBest >= flow.beforeBest ? "+" : ""}
              {flow.afterBest - flow.beforeBest}%
            </span>
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
            <Link
              href="/learn"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              📚 ไปวิชาอื่นต่อ
            </Link>
            <button
              onClick={() => setStep("start")}
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50"
            >
              🔁 เรียนบทนี้อีกครั้ง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
