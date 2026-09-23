import Link from "next/link";
import { notFound } from "next/navigation";
import { SUBJECTS, getSubject } from "@/data/curriculum";
import { getQuiz } from "@/data/quizzes";
import QuizRunner from "@/components/QuizRunner";

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subjectId: s.id }));
}

export default async function QuizSubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const subject = getSubject(subjectId);
  const quiz = getQuiz(subjectId);
  if (!subject || !quiz) notFound();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/quiz" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              ✦
            </span>
            <p className="text-sm font-bold text-slate-900">แบบทดสอบ</p>
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/learn/${subject.id}`}
              className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-200"
            >
              📖 อ่านบทเรียน
            </Link>
            <Link
              href="/quiz"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              ← ทุกวิชา
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {subject.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
          เลือก Before class เพื่อวัดพื้นฐาน หรือ After class เพื่อวัดผลหลังเรียน
          — ทุกข้อมีเฉลยละเอียด
        </p>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <QuizRunner before={quiz.before} after={quiz.after} />
        </div>
      </main>
    </div>
  );
}
