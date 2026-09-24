"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ALL_SUBJECTS } from "@/data/curriculum";

type Tab = "text" | "links" | "file";

interface RefLink {
  url: string;
  domain: string;
  kind: string;
  icon: string;
}

interface SearchHit {
  subjectId: string;
  subjectTitle: string;
  lessonTitle: string;
  snippet: string;
}

function parseLink(raw: string): RefLink | null {
  let s = raw.trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return null;
  }
  if (!url.hostname.includes(".")) return null;
  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname.toLowerCase();
  let kind = "เว็บทั่วไป";
  let icon = "🌐";
  if (/youtube\.com|youtu\.be/.test(host)) {
    kind = "YouTube";
    icon = "🎬";
  } else if (path.endsWith(".pdf")) {
    kind = "PDF";
    icon = "📕";
  } else if (/docs\.google\.com|drive\.google\.com/.test(host)) {
    kind = "Google Docs/Drive";
    icon = "📄";
  } else if (/wikipedia\.org/.test(host)) {
    kind = "Wikipedia";
    icon = "📚";
  } else if (/github\.com/.test(host)) {
    kind = "GitHub";
    icon = "💻";
  }
  return { url: url.toString(), domain: host, kind, icon };
}

/** ค้นหาบทเรียนจริงจากคลังทุกวิชา — ให้คะแนน title > summary > เนื้อหา */
function searchLessons(query: string): SearchHit[] {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return [];
  const hits: (SearchHit & { score: number })[] = [];
  for (const s of ALL_SUBJECTS) {
    for (const l of s.lessons) {
      const title = l.title.toLowerCase();
      const summary = l.summary.toLowerCase();
      const bodies = (l.sections ?? [])
        .map((x) => `${x.heading} ${x.body}`.toLowerCase())
        .join(" ");
      let score = 0;
      for (const t of tokens) {
        if (title.includes(t)) score += 3;
        if (summary.includes(t)) score += 2;
        if (bodies.includes(t)) score += 1;
      }
      // โบนัส: ตรงชื่อวิชา
      if (tokens.some((t) => s.title.toLowerCase().includes(t))) score += 2;
      if (score > 0) {
        const firstBody = l.sections?.[0]?.body ?? l.summary;
        hits.push({
          subjectId: s.id,
          subjectTitle: s.title,
          lessonTitle: l.title,
          snippet:
            firstBody.length > 140 ? firstBody.slice(0, 140) + "…" : firstBody,
          score,
        });
      }
    }
  }
  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((h) => ({
      subjectId: h.subjectId,
      subjectTitle: h.subjectTitle,
      lessonTitle: h.lessonTitle,
      snippet: h.snippet,
    }));
}

const TABS: { id: Tab; label: string }[] = [
  { id: "text", label: "✍️ ข้อความ" },
  { id: "links", label: "🔗 ลิงก์อ้างอิง" },
  { id: "file", label: "📎 ไฟล์" },
];

const SUGGESTIONS = ["สมการ", "พีทาโกรัส", "เซลล์", "ไฟฟ้า", "ฟังก์ชัน", "พันธุกรรม"];

export default function InputSection() {
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [links, setLinks] = useState<RefLink[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<SearchHit[] | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const hasContent = text.trim() !== "" || links.length > 0 || fileName !== null;

  const addLink = () => {
    const parsed = parseLink(linkInput);
    if (!parsed) {
      setLinkError("ลิงก์ไม่ถูกต้อง ลองเช็กว่ามีชื่อเว็บครบไหม (เช่น youtube.com/...)");
      return;
    }
    if (links.some((l) => l.url === parsed.url)) {
      setLinkError("ลิงก์นี้เพิ่มไปแล้ว");
      return;
    }
    setLinks((prev) => [...prev, parsed]);
    setLinkInput("");
    setLinkError(null);
  };

  const handleSubmit = () => {
    if (!hasContent) return;
    // ค้นหาจริงจากคลังบทเรียน (ข้อความ + ชื่อไฟล์ + domain ลิงก์)
    const query = [
      text,
      fileName?.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ") ?? "",
      ...links.map((l) => l.domain.split(".")[0]),
    ]
      .join(" ")
      .trim();
    setLastQuery(query);
    setResults(searchLessons(query));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
            01 — รับข้อมูล
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            ส่งเนื้อหาที่อยากเรียน
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            พิมพ์ชื่อเรื่อง → ระบบค้นหาบทเรียนจริงในคลังให้ทันที
          </p>
        </div>
        <span className="hidden rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 sm:inline-block">
          Input Section
        </span>
      </div>

      <div
        role="tablist"
        aria-label="วิธีส่งข้อมูล"
        className="mb-4 inline-flex w-full rounded-full border border-slate-200 bg-slate-100 p-1.5 sm:w-auto"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all sm:flex-none sm:px-6 ${
              tab === t.id
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "text" && (
        <div>
          <label
            htmlFor="learning-input"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            ชื่อเรื่องหรือคำอธิบาย (เช่น “สมการ ม.2”, “ไฟฟ้า”)
          </label>
          <textarea
            id="learning-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="ส่งไฟล์เรียนหรือชื่อเรื่องพร้อมคำอธิบายมาเลย..."
            className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-xs text-slate-400">ลองค้น:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setText(s)}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 hover:bg-sky-100 hover:text-sky-700"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "links" && (
        <div>
          <label
            htmlFor="ref-link-input"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            วางลิงก์อ้างอิง (YouTube / PDF / เว็บ / เอกสาร — รับหมด)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="ref-link-input"
              value={linkInput}
              onChange={(e) => {
                setLinkInput(e.target.value);
                setLinkError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="วางลิงก์แล้วกด Enter เช่น https://youtube.com/..."
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={addLink}
              className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              + เพิ่ม
            </button>
          </div>
          {linkError && (
            <p className="mt-2 text-xs text-rose-600">{linkError}</p>
          )}
          {links.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {links.map((l) => (
                <li
                  key={l.url}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5"
                >
                  <span className="text-lg" aria-hidden>
                    {l.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {l.url}
                    </p>
                    <p className="text-xs text-slate-500">
                      {l.kind} • {l.domain}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setLinks((prev) => prev.filter((x) => x.url !== l.url))
                    }
                    aria-label={`ลบลิงก์ ${l.url}`}
                    className="rounded-full px-2 py-1 text-sm text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-center text-xs text-slate-400">
              ยังไม่มีลิงก์ — วางลิงก์อะไรก็ได้ที่เกี่ยวกับบทเรียน
              ระบบจะแยกประเภทให้อัตโนมัติ
            </p>
          )}
        </div>
      )}

      {tab === "file" && (
        <div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
          >
            <span className="text-2xl" aria-hidden>
              📎
            </span>
            {fileName ? (
              <span className="font-semibold text-slate-800">{fileName}</span>
            ) : (
              <>
                <span className="font-semibold">คลิกเพื่อเลือกไฟล์</span>
                <span className="text-xs text-slate-400">
                  PDF / รูปภาพ / เอกสารชีทเรียน (ชื่อไฟล์จะใช้ค้นหาบทเรียนด้วย)
                </span>
              </>
            )}
          </button>
          {fileName && (
            <button
              type="button"
              onClick={() => {
                setFileName(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="mt-2 text-xs text-slate-500 underline hover:text-slate-700"
            >
              ล้างไฟล์
            </button>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs text-slate-500">
          {hasContent ? (
            <>
              พร้อมค้น:{" "}
              {[
                text.trim() && "ข้อความ",
                links.length > 0 && `ลิงก์ ${links.length} รายการ`,
                fileName && "ไฟล์ 1 ไฟล์",
              ]
                .filter(Boolean)
                .join(" + ")}
            </>
          ) : (
            "ยังไม่มีข้อมูล — เพิ่มข้อความ ลิงก์ หรือไฟล์ก่อนกดค้น"
          )}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasContent}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
          🔍 ค้นหาบทเรียน →
        </button>
      </div>

      {/* ผลการค้นหาจริง */}
      {results !== null && (
        <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50/50 p-4 sm:p-5">
          <p className="text-sm font-bold text-slate-900">
            🔍 ผลการค้นหา “{lastQuery.slice(0, 60)}”
            {results.length > 0 && (
              <span className="ml-2 font-medium text-slate-500">
                เจอ {results.length} บทเรียน
              </span>
            )}
          </p>
          {results.length > 0 ? (
            <ul className="mt-3 space-y-2.5">
              {results.map((r, i) => (
                <li
                  key={`${r.subjectId}-${i}`}
                  className="rounded-xl border border-slate-200 bg-white p-3.5"
                >
                  <p className="text-xs font-medium text-sky-700">
                    {r.subjectTitle}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {r.lessonTitle}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {r.snippet}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <Link
                      href={`/study/${r.subjectId}`}
                      className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      🧭 เรียนแบบนำทาง
                    </Link>
                    <Link
                      href={`/quiz/${r.subjectId}`}
                      className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                    >
                      📝 สอบก่อนเรียน
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center">
              <p className="text-sm text-slate-500">
                ยังไม่เจอบทเรียนที่ตรง ลองคำอื่น หรือเลือกวิชาในคลังเลย:
              </p>
              <Link
                href="/learn"
                className="mt-2 inline-block rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
              >
                📚 เปิดคลังบทเรียนทั้งหมด
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
