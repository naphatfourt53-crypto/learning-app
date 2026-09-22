"use client";

import { useRef, useState } from "react";

export default function InputSection() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!text.trim() && !fileName) return;
    alert(
      `รับข้อมูลแล้ว!\n${fileName ? `ไฟล์: ${fileName}\n` : ""}ข้อความ: ${text.slice(0, 120)}`
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
            01 — รับข้อมูล
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            ส่งเนื้อหาที่อยากเรียน
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            วางข้อความ อัปโหลดไฟล์ หรือพิมพ์ชื่อเรื่องพร้อมคำอธิบาย
          </p>
        </div>
        <span className="hidden rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 sm:inline-block">
          Input Section
        </span>
      </div>

      <label
        htmlFor="learning-input"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        รายละเอียดบทเรียน
      </label>
      <textarea
        id="learning-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="ส่งไฟล์เรียนหรือชื่อเรื่องพร้อมคำอธิบายมาเลย..."
        className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
      />

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 sm:flex-none sm:px-5"
        >
          <span aria-hidden>📎</span>
          {fileName ? fileName : "อัปโหลดไฟล์ / ข้อความ"}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() && !fileName}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
          วิเคราะห์เนื้อหา →
        </button>
        {fileName && (
          <button
            type="button"
            onClick={() => {
              setFileName(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="text-xs text-slate-500 underline hover:text-slate-700"
          >
            ล้างไฟล์
          </button>
        )}
      </div>
    </section>
  );
}
