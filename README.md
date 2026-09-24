# learning-app
learnStep v1 — Self-Learning: ส่งเนื้อหา เลือกหัวข้อใกล้เคียง ทำแบบทดสอบ Before/After

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Login ด้วย GitHub (ปุ่มเข้าสู่ระบบ)

แอปใช้ Auth.js + GitHub OAuth ต้องตั้งค่า 2 อย่าง:

1. สร้าง GitHub OAuth App ที่ https://github.com/settings/developers
   - Homepage URL: `https://<โดเมน vercel ของคุณ>`
   - Authorization callback URL: `https://<โดเมน vercel ของคุณ>/api/auth/callback/github`
   - (dev ในเครื่อง: `http://localhost:3000` และ `http://localhost:3000/api/auth/callback/github`)
2. ตั้งค่า Environment Variables (ไฟล์ `.env.local` หรือ Vercel → Settings → Environment Variables):
   - `AUTH_SECRET=` (สุ่มด้วย `npx auth secret`)
   - `AUTH_GITHUB_ID=` + `AUTH_GITHUB_SECRET=` (จากข้อ 1)
   - `GEMINI_API_KEY=` (ไม่บังคับ — ถ้าไม่ตั้ง ผู้ใช้กรอกคีย์ตัวเองในหน้าข้อสอบได้ ขอฟรีที่ https://aistudio.google.com/apikey)

ถ้ายังไม่ตั้งค่า env ปุ่ม login จะไม่แสดง (by design — แอปใช้งานส่วนอื่นได้ปกติ)

## AI ช่วยใบ้/อธิบาย (`POST /api/ai`)

ใช้ Gemini (`gemini-2.0-flash`) ผ่าน AI Studio API โดยไม่ต้องลง SDK เพิ่ม:
- mode `hint`: ใบ้โดยไม่สปอยล์คำตอบ (กดได้ก่อนตอบ)
- mode `explain`: อธิบายเพิ่มหลังเห็นเฉลย (ใช้เฉลยเดิมเป็นบริบท)
- ลำดับคีย์: `GEMINI_API_KEY` บนเซิร์ฟเวอร์ → คีย์ที่ผู้ใช้กรอก (เก็บใน localStorage เครื่องตัวเอง)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
