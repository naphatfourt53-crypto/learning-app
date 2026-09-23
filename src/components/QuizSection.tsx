"use client";

import { useState } from "react";

type Tab = "before" | "after";

const QUIZZES: Record<
  Tab,
  { id: number; title: string; meta: string; questions: number; minutes: number; level: string }[]
> = {
  before: [
    { id: 1, title: "Pre-test: ความรู้พื้นฐานการสังเคราะห์ด้วยแสง", meta: "10 ข้อ • วัดพื้นฐานก่อนเรียน", questions: 10, minutes: 10, level: "ง่าย" },
    { id: 2, title: "Pre-test: คำศัพท์ชีววิทยาที่ควรรู้", meta: "8 ข้อ • คำศัพท์สำคัญ", questions: 8, minutes: 8, level: "ง่าย" },
    { id: 3, title: "Pre-test: แผนภาพเซลล์พืช", meta: "6 ข้อ • ระบุส่วนประกอบ", questions: 6, minutes: 5, level: "ปานกลาง" },
  ],
  after: [
    { id: 1, title: "Post-test: สมการและปัจจัยการสังเคราะห์แสง", meta: "12 ข้อ • วัดความเข้าใจหลังเรียน", questions: 12, minutes: 15, level: "ปานกลาง" },
    { id: 2, title: "Post-test: วิเคราะห์การทดลอง", meta: "10 ข้อ • ตีความกราฟผลทดลอง", questions: 10, minutes: 15, level: "ยาก" },
    { id: 3, title: "Post-test: โจทย์รวม + เฉลยละเอียด", meta: "15 ข้อ • พร้อมเฉลยวิดีโอ", questions: 15, minutes: 20, level: "ผสม" },
  ],
};

export default function QuizSection() {
  const [tab, setTab] = useState<Tab>("before");
  const [startedId, setStartedId] = useState<number | null>(null);

  const list = QUIZZES[tab];
  const isBefore = tab === "before";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header + Profile — ปรับ padding ให้หายใจได้: p-5 / sm:p-6 / md:p-8 */}
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

        {/* User Profile card */}
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 pr-5 backdrop-blur sm:p-4 sm:pr-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-lg font-bold">
            ST
          </div>
          <div>
            <p className="text-sm font-semibold">Student User</p>
            <p className="text-xs text-slate-300">Lv. 5 • นักเรียนชีววิทยา</p>
            <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-2/3 rounded-full bg-emerald-400" />
            </div>
          </div>
          <span className="ml-2 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
            68 XP
          </span>
        </div>
      </div>

      {/* Body — ระยะห่างเนื้อหา mx/margin สม่ำเสมอ */}
      <div className="space-y-6 p-5 sm:p-6 md:p-8">
        {/* Toggle Before / After */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="เลือกแบบทดสอบ"
            className="inline-flex w-full rounded-full border border-slate-200 bg-slate-100 p-1.5 sm:w-auto"
          >
            <button
              role="tab"
              aria-selected={isBefore}
              onClick={() => {
                setTab("before");
                setStartedId(null);
              }}
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
              onClick={() => {
                setTab("after");
                setStartedId(null);
              }}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-8 ${
                !isBefore
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ✅ After class
            </button>
          </div>
          <p className="text-sm text-slate-500">
            {isBefore ? (
              <>
                สถานะ: <span className="font-semibold text-sky-700">ยังไม่เริ่ม • 3 ชุด</span>
              </>
            ) : (
              <>
                สถานะ: <span className="font-semibold text-emerald-700">ปลดล็อกหลังเรียน • 3 ชุด</span>
              </>
            )}
          </p>
        </div>

        {/* Quiz list — การ์ดมี my/margin และ padding ชัดเจน */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((q) => {
            const active = startedId === q.id;
            return (
              <div
                key={`${tab}-${q.id}`}
                className={`flex flex-col rounded-xl border p-5 transition ${
                  active
                    ? isBefore
                      ? "border-sky-400 bg-sky-50/60 shadow-md"
                      : "border-emerald-400 bg-emerald-50/60 shadow-md"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                <span
                  className={`mb-3 w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isBefore
                      ? "bg-sky-100 text-sky-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {isBefore ? "BEFORE" : "AFTER"} • {q.level}
                </span>
                <h3 className="text-[15px] font-semibold leading-snug text-slate-900">
                  {q.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {q.meta} • ⏱ {q.minutes} นาที
                </p>
                <button
                  onClick={() => setStartedId(active ? null : q.id)}
                  className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : isBefore
                        ? "bg-slate-900 text-white hover:bg-sky-700"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {active ? "กำลังทำอยู่… (กดเพื่อยกเลิก)" : "เริ่มทำแบบทดสอบ"}
                </button>
                {active && (
                  <div className="mt-3 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-inner">
                    {isBefore
                      ? "💡 ชุดนี้ไม่มีจับเวลาเข้มงวด ทำสบายๆ เพื่อวัดพื้นฐานก่อนเรียน"
                      : "🎯 ชุดนี้จะเปรียบเทียบคะแนนกับ Before class ให้อัตโนมัติ"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary bar — mt แยกจาก list ชัดเจน */}
        <div className="mt-2 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 sm:p-5">
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Before เฉลี่ย</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">62%</p>
          </div>
          <div className="border-t border-slate-200 pt-3 text-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">After ล่าสุด</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">—</p>
          </div>
          <div className="border-t border-slate-200 pt-3 text-center sm:border-l sm:border-t-0 sm:pl-5 sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">พัฒนาการ</p>
            <p className="mt-1 text-2xl font-bold text-sky-600">+0%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
