"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ALL_SUBJECTS } from "@/data/curriculum";
import { getQuestionBank, type QuizQuestion } from "@/data/quizzes";
import PracticeRunner, {
  type PracticeConfig,
  type PracticeItem,
} from "@/components/PracticeRunner";

type Tab = "basic" | "advanced";
type Purpose = "ทบทวนเนื้อหา" | "วัดพื้นฐานก่อนเรียน" | "เตรียมสอบจริง";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** สลับตัวเลือกพร้อม remap เฉลย (กันจำตำแหน่งข้อถูก) */
function shuffleChoices(q: QuizQuestion): QuizQuestion {
  const order = shuffle(q.choices.map((_, i) => i));
  const remap = (oldIdx: number) => order.indexOf(oldIdx);
  const out: QuizQuestion = {
    ...q,
    choices: order.map((i) => q.choices[i]),
  };
  if (q.correctIndex !== undefined) out.correctIndex = remap(q.correctIndex);
  if (q.correctIndices) out.correctIndices = q.correctIndices.map(remap);
  if (q.tier2) {
    const t2order = shuffle(q.tier2.choices.map((_, i) => i));
    out.tier2 = {
      ...q.tier2,
      choices: t2order.map((i) => q.tier2!.choices[i]),
      correctIndex: t2order.indexOf(q.tier2.correctIndex),
    };
  }
  return out;
}

const COUNTS = [4, 8, 12] as const;
const PURPOSES: Purpose[] = ["ทบทวนเนื้อหา", "วัดพื้นฐานก่อนเรียน", "เตรียมสอบจริง"];

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100">
          <main className="mx-auto w-full max-w-4xl px-4 py-10 text-center text-sm text-slate-500">
            กำลังโหลดห้องสร้างข้อสอบ…
          </main>
        </div>
      }
    >
      <PracticeBuilder />
    </Suspense>
  );
}

function PracticeBuilder() {
  // preset วิชาจากลิงก์ "ข้อสอบย่อยบทนี้" (?subjects=id1,id2)
  const params = useSearchParams();
  const preset = useMemo(() => {
    const raw = params.get("subjects");
    if (!raw) return null;
    const ids = raw.split(",").filter((id) => ALL_SUBJECTS.some((s) => s.id === id));
    return ids.length > 0 ? ids : null;
  }, [params]);
  const [tab, setTab] = useState<Tab>("basic");
  const [pickedSubjects, setPickedSubjects] = useState<string[]>(
    preset ?? ["math-ms"]
  );
  const [count, setCount] = useState<number | "all">(8);
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [purpose, setPurpose] = useState<Purpose>("ทบทวนเนื้อหา");
  const [kinds, setKinds] = useState<string[]>(["single", "multi", "twotier"]);
  const [timed, setTimed] = useState<number | null>(null);
  const [doShuffle, setDoShuffle] = useState(true);
  const [explain, setExplain] = useState<"now" | "end">("now");
  const [passing, setPassing] = useState(70);
  const [run, setRun] = useState<{ items: PracticeItem[]; config: PracticeConfig } | null>(null);

  const bank = useMemo(() => getQuestionBank(), []);
  const titles = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of ALL_SUBJECTS) m[s.id] = s.title;
    return m;
  }, []);

  const toggleSubject = (id: string) =>
    setPickedSubjects((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const toggleKind = (k: string) =>
    setKinds((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const start = () => {
    let pool = bank.filter(
      (b) =>
        pickedSubjects.includes(b.subjectId) &&
        (difficulty === "all" || (b.question.difficulty ?? "medium") === difficulty) &&
        kinds.includes(b.question.kind ?? "single")
    );
    if (pool.length === 0) {
      alert("ไม่มีข้อสอบตรงเงื่อนไข ลองปรับวิชา/ระดับ/ชนิดข้อใหม่");
      return;
    }
    pool = shuffle(pool);
    const n = count === "all" ? pool.length : Math.min(count, pool.length);
    const items: PracticeItem[] = pool.slice(0, n).map((b) => ({
      subjectTitle: titles[b.subjectId] ?? b.subjectId,
      mode: b.mode,
      question: doShuffle ? shuffleChoices(b.question) : b.question,
    }));
    setRun({
      items,
      config: {
        purpose,
        showExplanations: explain,
        passing,
        timedSeconds: timed === null ? null : timed * 60,
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setPurposeSmart = (p: Purpose) => {
    setPurpose(p);
    if (p === "เตรียมสอบจริง") {
      setDoShuffle(true);
      setExplain("end");
      if (timed === null) setTimed(10);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              🎯
            </span>
            <p className="text-sm font-bold text-slate-900">สร้างแบบทดสอบเอง</p>
          </Link>
          <Link
            href="/"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            ← หน้าหลัก
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-8">
        {!run ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <h1 className="text-2xl font-extrabold text-slate-900">
              🎯 สร้างชุดฝึกที่ตรงจุดที่สุด
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              แยกจากสอบ Before/After — ดึงข้อจากคลังทุกวิชามาผสมตามที่ตั้งค่า
              (ตอนนี้ {bank.length} ข้อ)
            </p>
            {preset && (
              <p className="mt-2 w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                🎯 มาจากปุ่ม “ข้อสอบย่อย” — เลือกวิชาให้แล้ว ปรับจำนวน/ระดับต่อได้เลย
              </p>
            )}

            <div
              role="tablist"
              aria-label="ระดับการปรับแต่ง"
              className="mt-5 inline-flex rounded-full border border-slate-200 bg-slate-100 p-1"
            >
              <button
                role="tab"
                aria-selected={tab === "basic"}
                onClick={() => setTab("basic")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab === "basic"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                📋 ปรับแต่งเบื้องต้น
              </button>
              <button
                role="tab"
                aria-selected={tab === "advanced"}
                onClick={() => setTab("advanced")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab === "advanced"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                ⚙️ ปรับแต่งขั้นสูง
              </button>
            </div>

            {/* วิชา */}
            <h2 className="mt-6 text-sm font-bold text-slate-900">
              1. เลือกวิชา (เลือกได้หลายวิชา)
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_SUBJECTS.map((s) => {
                const on = pickedSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSubject(s.id)}
                    aria-pressed={on}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      on
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>

            {/* จำนวน + ระดับ + วัตถุประสงค์ */}
            <h2 className="mt-6 text-sm font-bold text-slate-900">2. จำนวนข้อ</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    count === n
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                  }`}
                >
                  {n} ข้อ
                </button>
              ))}
              <button
                onClick={() => setCount("all")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  count === "all"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                }`}
              >
                ทั้งหมดที่ตรงเงื่อนไข
              </button>
            </div>

            <h2 className="mt-6 text-sm font-bold text-slate-900">3. ระดับความยาก</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["all", "คละทุกระดับ"],
                  ["easy", "ง่าย"],
                  ["medium", "ปานกลาง"],
                  ["hard", "ยาก"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setDifficulty(v)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    difficulty === v
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-sm font-bold text-slate-900">
              4. เอาไปใช้ทำอะไร (วัตถุประสงค์)
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPurposeSmart(p)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    purpose === p
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              เตรียมสอบจริง = สลับข้อ+ตัวเลือก + เฉลยท้ายชุด + จับเวลา 10 นาทีให้อัตโนมัติ
            </p>

            {tab === "advanced" && (
              <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/50 p-4 sm:p-5">
                <h2 className="text-sm font-bold text-violet-900">
                  ⚙️ ตัวเลือกขั้นสูง
                </h2>

                <p className="mt-4 text-xs font-bold text-slate-700">ชนิดข้อสอบ</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(
                    [
                      ["single", "เลือก 1 ข้อ"],
                      ["multi", "เลือกทุกข้อที่ถูก"],
                      ["twotier", "2 ชั้น"],
                    ] as const
                  ).map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => toggleKind(v)}
                      aria-pressed={kinds.includes(v)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                        kinds.includes(v)
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 bg-white text-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-xs font-bold text-slate-700">จับเวลา</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(
                    [
                      [null, "ไม่จับเวลา"],
                      [5, "5 นาที"],
                      [10, "10 นาที"],
                      [15, "15 นาที"],
                    ] as const
                  ).map(([v, label]) => (
                    <button
                      key={label}
                      onClick={() => setTimed(v)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                        timed === v
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 bg-white text-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setDoShuffle((v) => !v)}
                    aria-pressed={doShuffle}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      doShuffle
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300 bg-white text-slate-600"
                    }`}
                  >
                    🔀 สลับข้อ+ตัวเลือก: {doShuffle ? "เปิด" : "ปิด"}
                  </button>
                  <button
                    onClick={() =>
                      setExplain((e) => (e === "now" ? "end" : "now"))
                    }
                    className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    📝 เฉลย: {explain === "now" ? "ทันทีทุกข้อ" : "รวมท้ายชุด"}
                  </button>
                </div>

                <p className="mt-4 text-xs font-bold text-slate-700">
                  เกณฑ์ผ่าน: {passing}%
                </p>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={passing}
                  onChange={(e) => setPassing(Number(e.target.value))}
                  className="mt-1.5 w-full accent-violet-600"
                />
              </div>
            )}

            <button
              onClick={start}
              disabled={pickedSubjects.length === 0 || kinds.length === 0}
              className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-40 sm:w-auto sm:px-10"
            >
              🚀 สร้างชุดฝึก →
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <PracticeRunner
              items={run.items}
              config={run.config}
              onExit={() => setRun(null)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
