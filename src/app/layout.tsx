import type { Metadata } from "next";
import { Geist, Geist_Mono, Prompt } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ฟอนต์ไทยหลัก + ครอบคลุมอักษรพิเศษ (π √ θ ฯลฯ) ป้องกันตัวอักษรเพี้ยนเป็นกล่อง/TT
const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Self-Learning | เรียนรู้ด้วยตนเอง",
  description: "ส่งเนื้อหา เลือกหัวข้อใกล้เคียง ทำแบบทดสอบ Before/After",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${prompt.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
