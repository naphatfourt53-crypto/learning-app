import Link from "next/link";
import InputSection from "@/components/InputSection";
import RecommendationSection from "@/components/RecommendationSection";
import QuizSection from "@/components/QuizSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top navbar — ทึบแสงเพื่อไม่ให้เนื้อหาเลื่อนลอดใต้แล้วดูซ้อน */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              ✦
            </span>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">
                Self-Learning
              </p>
              <p className="text-xs leading-tight text-slate-500">
                เรียนรู้ด้วยตนเอง
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <Link href="/" className="hover:text-slate-900">หน้าหลัก</Link>
            <Link href="/learn" className="hover:text-slate-900">บทเรียน</Link>
            <Link href="/quiz" className="hover:text-slate-900">แบบทดสอบ</Link>
            <Link href="/practice" className="hover:text-slate-900">ฝึกเอง 🎯</Link>
          </nav>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            เข้าสู่ระบบ
          </button>
        </div>
      </header>

      {/* Main — Responsive container + เว้นระยะสม่ำเสมอ */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 md:py-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            สวัสดี 👋 มาเริ่มบทเรียนใหม่กัน
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mx-0 sm:text-base">
            ส่งเนื้อหาที่อยากเรียน → เลือกหัวข้อที่ใกล้เคียง → ทำแบบทดสอบ
            Before / After เพื่อวัดพัฒนาการ
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/learn"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-700"
            >
              📚 เปิดคลังบทเรียน (20 วิชา)
            </Link>
            <Link
              href="/practice"
              className="rounded-xl bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50"
            >
              🎯 สร้างชุดฝึกเอง
            </Link>
          </div>
        </div>

        <InputSection />
        <RecommendationSection />
        <QuizSection />

        <footer className="pb-6 pt-2 text-center text-xs text-slate-400">
          Self-Learning App • Next.js App Router + Tailwind CSS • Responsive
          Mobile → Desktop
        </footer>
      </main>
    </div>
  );
}
