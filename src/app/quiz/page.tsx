import Link from "next/link";
import { ALL_SUBJECTS } from "@/data/curriculum";
import { getQuiz } from "@/data/quizzes";

export default function QuizIndexPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              ✦
            </span>
            <p className="text-sm font-bold text-slate-900">แบบทดสอบ</p>
          </Link>
          <Link
            href="/"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            ← หน้าหลัก
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          เลือกวิชาที่จะทำแบบทดสอบ 📝
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          ทุกวิชามีทั้ง Before class และ After class พร้อมเฉลยละเอียด
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ALL_SUBJECTS.map((s) => {
            const q = getQuiz(s.id);
            if (!q) return null;
            return (
              <Link
                key={s.id}
                href={`/quiz/${s.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">
                  {s.title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Before {q.before.questions.length} ข้อ • After{" "}
                  {q.after.questions.length} ข้อ
                </p>
                <span className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white group-hover:bg-emerald-600">
                  เริ่มทำ →
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
