import { NextResponse } from "next/server";

/**
 * GET /api/auth-debug — หน้าช่วยเช็ก login โดยไม่เปิดเผยความลับ
 * เปิดบน production แล้วเทียบค่ากับหน้า GitHub OAuth App:
 * - callbackUrl ต้องมีอยู่ใน Redirect URIs เป๊ะๆ
 * - clientIdPrefix ต้องตรงกับ Client ID ของแอปตัวที่แก้
 */
export async function GET(req: Request) {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "unknown";
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const callbackUrl = `${proto}://${host}/api/auth/callback/github`;
  const clientId = process.env.AUTH_GITHUB_ID ?? "";
  const hasSecret = Boolean(process.env.AUTH_GITHUB_SECRET);
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET);

  return NextResponse.json({
    host,
    callbackUrl,
    providerConfigured: Boolean(clientId && process.env.AUTH_GITHUB_SECRET),
    clientIdPrefix: clientId ? `${clientId.slice(0, 6)}…` : "(ยังไม่ตั้งค่า)",
    clientIdLength: clientId.length,
    hasClientSecret: hasSecret,
    hasAuthSecret,
    hint: "เอา callbackUrl ข้างบนไปใส่ใน GitHub OAuth App ช่อง Redirect URI เป๊ะๆ แล้วกด Update",
  });
}
