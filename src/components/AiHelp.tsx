"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/data/quizzes";

function readKey(): string {
  try {
    return localStorage.getItem("gemini-key") ?? "";
  } catch {
    return "";
  }
}

/**
 * ปุ่มช่วยจาก AI ต่อ 1 ข้อ:
 * - ก่อนตอบ: 💡 ขอ Hint (ใบ้โดยไม่สปอยล์)
 * - หลังตอบ: 📖 อธิบายเพิ่ม (ลึกกว่าเฉลยเดิม)
 * ใช้คีย์ของผู้ใช้เอง (เก็บในเบราว์เซอร์) หรือ GEMINI_API_KEY บนเซิร์ฟเวอร์
 */
export default function AiHelp({
  question,
  answered,
}: {
  question: QuizQuestion;
  answered: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(readKey);
  const [keySaved, setKeySaved] = useState(readKey() !== "");
  const [loading, setLoading] = useState<"hint" | "explain" | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveKey = () => {
    try {
      localStorage.setItem("gemini-key", key.trim());
    } catch {
      /* private mode */
    }
    setKeySaved(key.trim() !== "");
  };

  const ask = async (mode: "hint" | "explain") => {
    setLoading(mode);
    setError(null);
    setResult(null);
    try {
      const kind = question.kind ?? "single";
      const correctText =
        kind === "multi"
          ? (question.correctIndices ?? [])
              .map((i) => question.choices[i])
              .join(" / ")
          : kind === "twotier"
            ? `${question.choices[question.correctIndex ?? 0]} + เหตุผล: ${question.tier2?.choices[question.tier2.correctIndex] ?? ""}`
            : (question.correctIndex !== undefined
                ? question.choices[question.correctIndex]
                : undefined);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          question: question.question,
          choices: question.choices,
          correctText,
          explanation: question.explanation,
          key: key.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "เกิดข้อผิดพลาด");
      else setResult(data.text);
    } catch {
      setError("เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง");
    } finally {
      setLoading(null);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-xs font-semibold text-violet-700 hover:text-violet-900"
      >
        🤖 ช่วยจาก AI {answered ? "(อธิบายเพิ่ม)" : "(ขอ Hint)"} ▸
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/60 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-violet-900">🤖 ช่วยจาก AI</p>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          ซ่อน
        </button>
      </div>

      {!keySaved && (
        <div className="mt-2">
          <p className="text-[11px] leading-relaxed text-slate-500">
            วาง Gemini API Key ของตัวเอง (ขอฟรีที่ aistudio.google.com/apikey
            เก็บในเบราว์เซอร์เครื่องนี้เท่านั้น)
          </p>
          <div className="mt-1.5 flex gap-1.5">
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIza..."
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs focus:border-violet-500 focus:outline-none"
            />
            <button
              onClick={saveKey}
              className="shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
            >
              จำไว้
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {!answered && (
          <button
            onClick={() => ask("hint")}
            disabled={loading !== null}
            className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {loading === "hint" ? "กำลังคิด…" : "💡 ขอ Hint (ไม่สปอยล์)"}
          </button>
        )}
        {answered && (
          <button
            onClick={() => ask("explain")}
            disabled={loading !== null}
            className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {loading === "explain" ? "กำลังคิด…" : "📖 อธิบายเพิ่ม"}
          </button>
        )}
        {keySaved && (
          <button
            onClick={() => {
              setKey("");
              setKeySaved(false);
              try {
                localStorage.removeItem("gemini-key");
              } catch {
                /* ignore */
              }
            }}
            className="text-[11px] text-slate-400 underline hover:text-slate-600"
          >
            ลบคีย์
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-rose-50 p-2.5 text-xs leading-relaxed text-rose-700">
          {error}
        </p>
      )}
      {result && (
        <p className="mt-2 whitespace-pre-line rounded-lg bg-white p-2.5 text-xs leading-relaxed text-slate-700">
          {result}
        </p>
      )}
    </div>
  );
}
