import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_SUBJECTS, getSubject } from "@/data/curriculum";
import { getQuiz } from "@/data/quizzes";
import StudyFlow from "@/components/StudyFlow";

export function generateStaticParams() {
  return ALL_SUBJECTS.map((s) => ({ subjectId: s.id }));
}

export default async function StudyPage({
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
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href={`/learn/${subject.id}`} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              🧭
            </span>
            <p className="text-sm font-bold text-slate-900">เรียนแบบนำทาง</p>
          </Link>
          <Link
            href={`/learn/${subject.id}`}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            ← กลับหน้าวิชา
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-8">
        <StudyFlow subject={subject} quiz={quiz} />
      </main>
    </div>
  );
}
