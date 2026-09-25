"use client";

import { useState } from "react";
import Link from "next/link";

function readTheme(): "light" | "dark" {
  try {
    return localStorage.getItem("learnstep-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function GuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="แนะนำการใช้งาน"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            📖 แนะนำการใช้งาน
          </h2>
          <button
            onClick={onClose}
            aria-label="ปิด"
            className="rounded-full px-2.5 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
          <li className="rounded-xl bg-slate-50 p-3.5">
            <span className="font-bold">1. ค้นหาหรือเลือกวิชา</span> — พิมพ์ชื่อเรื่องในช่องค้นหาหน้าแรก
            หรือกด “เปิดคลังบทเรียน” เลือกตามชั้น (ประถม/ม.ต้น/ม.ปลาย)
          </li>
          <li className="rounded-xl bg-slate-50 p-3.5">
            <span className="font-bold">2. สอบ Before ก่อน</span> — วัดพื้นฐานดิบๆ
            ครั้งแรกต้องสอบก่อนถึงจะเรียนได้ ต้องผ่าน ≥70% After ถึงจะปลดล็อก
          </li>
          <li className="rounded-xl bg-slate-50 p-3.5">
            <span className="font-bold">3. อ่านบทเรียน</span> — ปรับได้ 3 โหมด:
            เบื้องต้น (สรุป) / ขั้นสูง (เต็ม+สูตร+ตัวอย่าง) / ⚡สรุปเตรียมสอบ
          </li>
          <li className="rounded-xl bg-slate-50 p-3.5">
            <span className="font-bold">4. สอบ After + สอบรวม</span> — วัดพัฒนาการ
            หรือกด “สอบรวม” เพื่อตะลุยทุกข้อพร้อมจับเวลา
          </li>
          <li className="rounded-xl bg-slate-50 p-3.5">
            <span className="font-bold">5. สร้างชุดฝึกเอง</span> — เมนู “ฝึกเอง 🎯”
            เลือกวิชา/จำนวน/ยากง่าย/จับเวลาได้ตามใจ
          </li>
          <li className="rounded-xl bg-slate-50 p-3.5">
            <span className="font-bold">6. โหมดกลางคืน</span> — กด ☰ มุมขวาบน
            แล้วสลับ 🌞/🌙 ใช้อ่านตอนกลางคืนสบายตา
          </li>
        </ol>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          เริ่มใช้งาน →
        </button>
      </div>
    </div>
  );
}

/** ปุ่ม ☰ มุม header: เมนูลัด + สลับโหมดเช้า/ค่ำ + คู่มือใช้งาน */
export default function HeaderMenu() {
  const [open, setOpen] = useState(false);
  // อ่านธีมครั้งเดียวตอน mount (lazy init แทน effect)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      const t = readTheme();
      document.documentElement.classList.toggle("dark", t === "dark");
      return t;
    }
    return "light";
  });
  const [guide, setGuide] = useState(false);

  const switchTheme = (t: "light" | "dark") => {
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    try {
      localStorage.setItem("learnstep-theme", t);
    } catch {
      /* private mode */
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="เมนู"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-700 hover:bg-slate-200"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <button
              onClick={() => switchTheme(theme === "light" ? "dark" : "light")}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              <span>{theme === "light" ? "🌙 โหมดกลางคืน" : "🌞 โหมดกลางวัน"}</span>
              <span
                className={`relative h-5 w-9 rounded-full transition ${
                  theme === "dark" ? "bg-slate-900" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    theme === "dark" ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </span>
            </button>
            <button
              onClick={() => {
                setGuide(true);
                setOpen(false);
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              📖 แนะนำการใช้งาน
            </button>
            <div className="my-1 border-t border-slate-100" />
            {[
              ["/", "🏠 หน้าหลัก"],
              ["/learn", "📚 คลังบทเรียน"],
              ["/quiz", "📝 แบบทดสอบ"],
              ["/practice", "🎯 สร้างชุดฝึกเอง"],
              ["/leaderboard", "🏆 กระดานผู้นำ"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
      {guide && <GuideModal onClose={() => setGuide(false)} />}
    </div>
  );
}
