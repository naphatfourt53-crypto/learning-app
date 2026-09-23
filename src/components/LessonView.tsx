"use client";

import { useState } from "react";
import type { Lesson } from "@/data/curriculum";

type DetailMode = "basic" | "advanced";

interface ViewOpts {
  showFormulas: boolean;
  showExamples: boolean;
  showWarnings: boolean;
  largeText: boolean;
}

const DEFAULT_OPTS: ViewOpts = {
  showFormulas: true,
  showExamples: true,
  showWarnings: true,
  largeText: false,
};

function readOpts(): { mode: DetailMode; opts: ViewOpts } {
  try {
    const raw = localStorage.getItem("learnstep-lesson-view");
    if (raw) {
      const p = JSON.parse(raw) as { mode: DetailMode; opts: ViewOpts };
      if (p.mode === "basic" || p.mode === "advanced")
        return { mode: p.mode, opts: { ...DEFAULT_OPTS, ...p.opts } };
    }
  } catch {
    /* ใช้ค่าเริ่มต้น */
  }
  return { mode: "advanced", opts: DEFAULT_OPTS };
}

/**
 * มุมมองบทเรียนแบบปรับได้ 2 ระดับ:
 * - เบื้องต้น (basic): โชว์แค่สรุปย่อแต่ละบท
 * - ขั้นสูง (advanced): บทสอนเต็ม + สวิตช์เปิด/ปิด สูตร-ตัวอย่าง-คำเตือน + ขนาดตัวอักษร
 */
export default function LessonView({ lessons }: { lessons: Lesson[] }) {
  const [saved] = useState(readOpts);
  const [mode, setMode] = useState<DetailMode>(saved.mode);
  const [opts, setOpts] = useState<ViewOpts>(saved.opts);
  const [showSettings, setShowSettings] = useState(false);

  const persist = (m: DetailMode, o: ViewOpts) => {
    setMode(m);
    setOpts(o);
    try {
      localStorage.setItem(
        "learnstep-lesson-view",
        JSON.stringify({ mode: m, opts: o })
      );
    } catch {
      /* private mode */
    }
  };

  const toggle = (k: keyof ViewOpts) =>
    persist(mode, { ...opts, [k]: !opts[k] });

  const bodyCls = opts.largeText
    ? "text-base leading-relaxed"
    : "text-sm leading-relaxed";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          📖 บทเรียน (อ่านให้เข้าใจก่อนทำข้อสอบ)
        </h2>
        <div className="flex items-center gap-2">
          <div
            role="tablist"
            aria-label="ความละเอียดบทเรียน"
            className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1"
          >
            <button
              role="tab"
              aria-selected={mode === "basic"}
              onClick={() => persist("basic", opts)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                mode === "basic"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📋 ปรับแต่งเบื้องต้น
            </button>
            <button
              role="tab"
              aria-selected={mode === "advanced"}
              onClick={() => persist("advanced", opts)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                mode === "advanced"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚙️ ปรับแต่งขั้นสูง
            </button>
          </div>
        </div>
      </div>

      {mode === "advanced" && (
        <div className="mt-3">
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900"
          >
            {showSettings ? "▾ ซ่อนตัวเลือกขั้นสูง" : "▸ ตัวเลือกขั้นสูง (สูตร/ตัวอย่าง/คำเตือน/ตัวอักษร)"}
          </button>
          {showSettings && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["showFormulas", "📐 แสดงสูตร"],
                  ["showExamples", "💡 แสดงตัวอย่าง"],
                  ["showWarnings", "⚠️ แสดงจุดระวัง"],
                  ["largeText", "🔍 ตัวอักษรใหญ่"],
                ] as [keyof ViewOpts, string][]
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => toggle(k)}
                  aria-pressed={opts[k]}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    opts[k]
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-500 hover:border-slate-400"
                  }`}
                >
                  {label}: {opts[k] ? "เปิด" : "ปิด"}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 space-y-5">
        {lessons.map((l, i) => (
          <article
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-6"
          >
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
              {l.title}
            </h3>
            <p className={`mt-1.5 text-slate-600 ${bodyCls}`}>{l.summary}</p>
            {mode === "advanced" &&
              l.sections?.map((s, j) => (
                <div
                  key={j}
                  className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
                >
                  <h4 className="text-[15px] font-bold text-sky-800">
                    {s.heading}
                  </h4>
                  <p className={`mt-2 text-slate-700 ${bodyCls}`}>{s.body}</p>
                  {opts.showFormulas && s.formula && (
                    <p className="mt-2.5 rounded-lg bg-slate-900 px-3.5 py-2.5 font-mono text-[13px] text-emerald-300">
                      📐 {s.formula}
                    </p>
                  )}
                  {opts.showExamples && s.example && (
                    <p className={`mt-2.5 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-emerald-900 ${bodyCls}`}>
                      <span className="font-bold">ตัวอย่าง: </span>
                      {s.example}
                    </p>
                  )}
                  {opts.showWarnings && s.warning && (
                    <p className={`mt-2.5 rounded-lg bg-amber-50 px-3.5 py-2.5 text-amber-900 ${bodyCls}`}>
                      <span className="font-bold">⚠️ ระวัง: </span>
                      {s.warning}
                    </p>
                  )}
                </div>
              ))}
          </article>
        ))}
      </div>
    </section>
  );
}
