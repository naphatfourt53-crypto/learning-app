import Link from "next/link";

const MOCK_TOPICS = [
  {
    id: 1,
    title: "Photosynthesis ม.4 — การสังเคราะห์ด้วยแสง",
    desc: "สมการเคมี ปัจจัยที่มีผล และแผนภาพคลอโรพลาสต์",
    tag: "ชีววิทยา",
    match: "98% ตรง",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 2,
    title: "Cellular Respiration — การหายใจระดับเซลล์",
    desc: "Glycolysis, Krebs cycle และ Electron Transport Chain",
    tag: "ชีววิทยา",
    match: "92% ใกล้เคียง",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    id: 3,
    title: "สมการเคมีพื้นฐาน ม.3",
    desc: "การดุลสมการ ปฏิกิริยาเคมี และสารละลาย",
    tag: "เคมี",
    match: "87% ใกล้เคียง",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: 4,
    title: "Newton's Laws — กฎการเคลื่อนที่",
    desc: "แรง มวล ความเร่ง พร้อมโจทย์คำนวณ 20 ข้อ",
    tag: "ฟิสิกส์",
    match: "84% ใกล้เคียง",
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    id: 5,
    title: "พันธุกรรม Mendelian Genetics",
    desc: "กฎของเมนเดล Punnett square และ pedigree",
    tag: "ชีววิทยา",
    match: "81% ใกล้เคียง",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: 6,
    title: "ระบบนิเวศและความหลากหลาย",
    desc: "ห่วงโซ่อาหาร วัฏจักรสาร และสิ่งแวดล้อม",
    tag: "ชีววิทยา",
    match: "78% ใกล้เคียง",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
];

export default function RecommendationSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
            02 — แนะนำเนื้อหา
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            เรื่องที่อาจตรงหรือใกล้เคียงกัน
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            พบ 6 หัวข้อที่ใกล้เคียงกับสิ่งที่คุณส่งมา — เลือกเพื่อเริ่มเรียน
          </p>
        </div>
        <button className="self-start rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:self-auto">
          ดูทั้งหมด →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_TOPICS.map((t) => (
          <article
            key={t.id}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${t.color}`}
              >
                {t.tag}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {t.match}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-sky-700">
              {t.title}
            </h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
              {t.desc}
            </p>
            <Link
              href="/learn"
              className="mt-4 block w-full rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-800 transition group-hover:bg-slate-900 group-hover:text-white"
            >
              เลือกหัวข้อนี้
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
