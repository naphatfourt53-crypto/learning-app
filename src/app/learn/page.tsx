import Link from "next/link";
import { ALL_SUBJECTS, type Subject } from "@/data/curriculum";
import { getQuiz } from "@/data/quizzes";

function SubjectCard({ s }: { s: Subject }) {
  const q = getQuiz(s.id);
  const count =
    (q?.before.questions.length ?? 0) + (q?.after.questions.length ?? 0);
  return (
    <Link
      href={`/learn/${s.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
          {s.category}
        </span>
        <span className="text-xs font-medium text-slate-400">
          {s.level} • {s.duration}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700">
        {s.title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
        {s.desc}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <span>📖 {s.lessons.length} บทเรียน</span>
        <span>📝 {count} ข้อสอบ</span>
        <span>📦 {s.resources.length} แหล่งข้อมูล</span>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  const groups: { title: string; ids: string[]; exam?: string }[] = [
    { title: "📕 ม.1", ids: ["math-m1", "sci-m1"], exam: "math-m1,sci-m1" },
    { title: "📗 ม.2", ids: ["math-m2", "sci-m2"], exam: "math-m2,sci-m2" },
    { title: "📘 ม.3", ids: ["math-m3", "sci-m3"], exam: "math-m3,sci-m3" },
    { title: "🎒 ม.ต้น (วิชารวม)", ids: ["eng-ms", "thai-ms", "soc-ms"], exam: "eng-ms,thai-ms,soc-ms" },
    { title: "🎓 มัธยมปลาย", ids: ["math-hs", "physics", "chemistry", "biology", "computing", "thai-hs", "eng-hs", "soc-hs"], exam: "math-hs,physics,chemistry,biology,computing,thai-hs,eng-hs,soc-hs" },
    { title: "🌱 ประถม", ids: ["sci-pri", "math-pri", "thai-pri", "eng-pri"], exam: "sci-pri,math-pri,thai-pri,eng-pri" },
    { title: "🚀 วิชาขั้นสูง (จาก LearnStep)", ids: ["oop", "calculus", "react", "genetics"] },
  ];
  const byId = new Map(ALL_SUBJECTS.map((s) => [s.id, s]));
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              ✦
            </span>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">
                Self-Learning
              </p>
              <p className="text-xs leading-tight text-slate-500">
                แหล่งเรียนรู้
              </p>
            </div>
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
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
          Learning Library — ย้ายจาก LearnStep
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          แหล่งสอนและเรียนรู้ 📚
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          เลือกวิชาเพื่อดูบทเรียน พื้นฐานที่ต้องรู้ก่อน บทเรียนต่อยอด
          แหล่งข้อมูลเพิ่มเติม และแบบทดสอบ Before / After — หรือกด
          🧭 เรียนแบบนำทางในหน้าวิชา และ 🎯 สร้างชุดฝึกเองที่หน้าแรก
        </p>

        {groups.map((g) => (
          <div key={g.title}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">{g.title}</h2>
              {g.exam && (
                <Link
                  href={`/practice?subjects=${g.exam}&exam=1`}
                  className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  📦 สอบรวมกลุ่มนี้
                </Link>
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {g.ids.map((id) => {
                const s = byId.get(id);
                if (!s) return null;
                return <SubjectCard key={id} s={s} />;
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
