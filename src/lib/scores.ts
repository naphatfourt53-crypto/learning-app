export interface BoardEntry {
  name: string;
  score: number;
}

/** id นิรนามของเครื่องนี้ (ใช้เมื่อยังไม่ login) */
export function anonId(): string {
  try {
    let id = localStorage.getItem("learnstep-anon");
    if (!id) {
      id = Math.random().toString(36).slice(2, 10);
      localStorage.setItem("learnstep-anon", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

/** ส่งคะแนนขึ้นบอร์ดกลาง (เงียบถ้าเซิร์ฟเวอร์ยังไม่ตั้งค่า DB) + อัปเดต streak ในเครื่อง */
export async function saveScore(
  subjectId: string,
  mode: "before" | "after",
  percent: number,
  name: string
): Promise<void> {
  touchStreak();
  try {
    await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectId,
        mode,
        percent,
        name,
        anonId: anonId(),
      }),
    });
  } catch {
    /* ออฟไลน์/ยังไม่ตั้งค่า DB — เก็บ local ไว้ก่อน */
  }
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** streak เรียนต่อเนื่อง (เก็บในเครื่อง): นับวันย้อนหลังจากวันนี้ที่ทำต่อเนื่อง */
export function touchStreak(): number {
  try {
    const raw = localStorage.getItem("learnstep-streak");
    const days: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const today = dayKey(new Date());
    if (!days.includes(today)) {
      days.push(today);
      localStorage.setItem("learnstep-streak", JSON.stringify(days.slice(-60)));
    }
    return streakOf(days);
  } catch {
    return 0;
  }
}

export function streakOf(days: string[]): number {
  const set = new Set(days);
  let n = 0;
  const d = new Date();
  // เริ่มนับจากวันนี้ (ถ้าวันนี้ยังไม่ทำ เริ่มจากเมื่อวาน)
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function readStreak(): number {
  try {
    const raw = localStorage.getItem("learnstep-streak");
    return streakOf(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return 0;
  }
}

export async function loadBoard(
  subjectId: string
): Promise<{ configured: boolean; before: BoardEntry[]; after: BoardEntry[] }> {
  try {
    const res = await fetch(`/api/scores?subject=${encodeURIComponent(subjectId)}`);
    return await res.json();
  } catch {
    return { configured: false, before: [], after: [] };
  }
}
