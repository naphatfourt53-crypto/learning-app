import Link from "next/link";
import { notFound } from "next/navigation";
import { SUBJECTS, getSubject } from "@/data/curriculum";
import { getQuiz } from "@/data/quizzes";

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subjectId: s.id }));
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const subject = getSubject(subjectId);
  if (!subject) notFound();
  const quiz = getQuiz(subjectId);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/learn" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              ✦
            </span>
            <p className="text-sm font-bold text-slate-900">แหล่งเรียนรู้</p>
          </Link>
          <Link
            href="/learn"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            ← ทุกวิชา
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 md:py-8">
        {/* หัวข้อวิชา */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white sm:p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
            {subject.category}
          </p>
          <h1 className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
            {subject.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            {subject.desc}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium">
              {subject.level}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium">
              ⏱ {subject.duration}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium">
              📖 {subject.lessons.length} บทเรียน
            </span>
          </div>
        </div>

        {/* บทเรียน */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">📖 บทเรียน</h2>
          <div className="mt-4 space-y-4">
            {subject.lessons.map((l, i) => (
              <article
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
              >
                <h3 className="text-[15px] font-semibold text-slate-900">
                  {l.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {l.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          {/* พื้นฐานที่ต้องรู้ก่อน */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              🧱 พื้นฐานที่ต้องรู้ก่อน
            </h2>
            <ul className="mt-3 space-y-3">
              {subject.prerequisites.map((p, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-amber-200/70 bg-white p-3.5"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {p.title}
                    {p.level && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                        {p.level}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {p.desc}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* บทเรียนต่อยอด */}
          <section className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              🚀 บทเรียนต่อยอด
            </h2>
            <ul className="mt-3 space-y-3">
              {subject.nextSteps.map((n, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-sky-200/70 bg-white p-3.5"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {n.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {n.desc}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* แหล่งข้อมูลเพิ่มเติม */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            📦 แหล่งข้อมูลเพิ่มเติม
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subject.resources.map((r, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-slate-200 p-4"
              >
                <span className="mb-2 w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {r.meta}
                </span>
                <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-500">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ปุ่มไปทำแบบทดสอบ */}
        {quiz && (
          <Link
            href={`/quiz/${subject.id}`}
            className="block rounded-2xl bg-slate-900 p-5 text-center text-white shadow-sm transition hover:bg-emerald-700 sm:p-6"
          >
            <p className="text-lg font-bold">
              📝 ทำแบบทดสอบ {subject.title} →
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Before {quiz.before.questions.length} ข้อ • After{" "}
              {quiz.after.questions.length} ข้อ พร้อมเฉลยละเอียด
            </p>
          </Link>
        )}
      </main>
    </div>
  );
}
