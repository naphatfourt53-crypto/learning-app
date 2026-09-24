"use client";

import { signIn, signOut, useSession } from "next-auth/react";

/** ปุ่มเข้าสู่ระบบ — แสดงชื่อย่อ + ออกจากระบบเมื่อ login แล้ว */
export default function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">
        …
      </span>
    );
  }

  if (session?.user) {
    const name = session.user.name ?? session.user.email ?? "ผู้ใช้";
    const initial = name.trim().charAt(0).toUpperCase();
    return (
      <span className="flex min-w-0 items-center gap-2">
        <span
          title={name}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-sm font-bold text-white"
        >
          {initial}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 md:inline">
          {name}
        </span>
        <button
          onClick={() => signOut()}
          className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
        >
          ออก
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
    >
      เข้าสู่ระบบ
    </button>
  );
}
