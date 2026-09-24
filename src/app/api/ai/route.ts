import { NextResponse } from "next/server";

const MODEL = "gemini-2.0-flash";

/**
 * POST /api/ai { mode: "hint" | "explain", question, choices?, correctText?, explanation?, key? }
 * - hint: ใบ้โดยไม่เฉลยคำตอบ (ใช้ก่อนตอบ)
 * - explain: อธิบายเพิ่มหลังเห็นเฉลยแล้ว
 * คีย์: ใช้ GEMINI_API_KEY จาก env ก่อน ถ้าไม่มีใช้ key ที่ผู้ใช้กรอก (เก็บในเบราว์เซอร์ตัวเอง)
 */
export async function POST(req: Request) {
  let body: {
    mode?: string;
    question?: string;
    choices?: string[];
    correctText?: string;
    explanation?: string;
    key?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "รูปแบบคำขอไม่ถูกต้อง" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY || body.key?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ยังไม่มี Gemini API Key — ขอฟรีที่ https://aistudio.google.com/apikey แล้ววางในช่อง 🔑 หรือตั้งค่า GEMINI_API_KEY บนเซิร์ฟเวอร์",
      },
      { status: 401 }
    );
  }

  const { mode, question, choices, correctText, explanation } = body;
  if (!question) {
    return NextResponse.json({ error: "ไม่มีโจทย์" }, { status: 400 });
  }

  const choiceText = (choices ?? []).map((c, i) => `${"กขคงจฉ"[i] ?? i + 1}. ${c}`).join("\n");

  const system =
    "คุณคือครูสอนพิเศษใจดีที่อธิบายสั้น กระชับ เป็นภาษาไทย เข้าใจง่ายระดับมัธยม ไม่เกิน 5 ประโยค ห้ามใช้อักษรพิเศษแปลกๆ";
  const prompt =
    mode === "explain"
      ? `${system}\n\nโจทย์: ${question}\nตัวเลือก:\n${choiceText}\nคำตอบที่ถูก: ${correctText ?? "-"}\nเฉลยเดิม: ${explanation ?? "-"}\n\nช่วยอธิบายเพิ่มเติมให้ลึกขึ้นอีกนิด: ทำไมข้อนี้ถึงถูก และจุดที่นักเรียนมักพลาดคืออะไร`
      : `${system}\n\nโจทย์: ${question}\nตัวเลือก:\n${choiceText}\n\nให้ "คำใบ้" ช่วยคิด (ห้ามบอก/สปอยล์คำตอบโดยตรง ห้ามบอกว่าข้อไหนถูก) ชี้แนวคิดหรือสูตรที่ต้องใช้ แล้วจบด้วยคำถามชวนคิด 1 ข้อ`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      }
    );
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json(
        { error: `AI ตอบกลับผิดพลาด (${res.status}) — ตรวจ API Key ดูอีกที ${t.slice(0, 120)}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("")?.trim() ??
      "";
    if (!text) {
      return NextResponse.json({ error: "AI ไม่ตอบอะไรกลับมา ลองใหม่อีกครั้ง" }, { status: 502 });
    }
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "เชื่อมต่อ AI ไม่ได้ ตรวจเน็ตแล้วลองใหม่" }, { status: 502 });
  }
}
