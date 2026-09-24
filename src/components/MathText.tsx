import { Fragment } from "react";

// ช่วงอักขระคณิต/กรีกที่ฟอนต์ไทยมักไม่มี glyph (π √ θ Ω ² ∞ → ≈ …)
// จับเป็นกลุ่มแล้วห่อด้วย .math-sym ที่ใช้ฟอนต์มีสัญลักษณ์ครบ
const MATH_RE =
  /([\u0370-\u03FF\u2200-\u22FF\u2070-\u209F\u00D7\u00F7\u221A\u221E\u2192\u2248\u2260\u2264\u2265\u00B1\u00B0]+)/g;

/** ครอบสัญลักษณ์คณิตในข้อความไทยด้วยฟอนต์ที่อ่านออกชัวร์ */
export default function MathText({ text }: { text: string }) {
  const parts = text.split(MATH_RE);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="math-sym">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}
