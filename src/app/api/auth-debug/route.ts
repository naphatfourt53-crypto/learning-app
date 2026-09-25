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
  const clientId = (process.env.AUTH_GITHUB_ID ?? "").trim();
  const clientSecret = (process.env.AUTH_GITHUB_SECRET ?? "").trim();
  const authSecret = (process.env.AUTH_SECRET ?? "").trim();
  const hasSecret = Boolean(clientSecret);
  const hasAuthSecret = Boolean(authSecret);

  return NextResponse.json({
    host,
    callbackUrl,
    providerConfigured: Boolean(clientId && clientSecret),
    clientIdPrefix: clientId ? `${clientId.slice(0, 6)}…` : "(ยังไม่ตั้งค่า)",
    clientIdLength: clientId.length,
    hasClientSecret: hasSecret,
    hasAuthSecret,
    // ตรวจคุณภาพค่าโดยไม่เปิดเผย: secret ต้องยาวพอและไม่มีช่องว่างติดมา
    clientSecretLooksOk: clientSecret.length >= 20 && !/\s/.test(clientSecret),
    authSecretLooksOk: authSecret.length >= 32 && !/\s/.test(authSecret),
    hint: "เอา callbackUrl ข้างบนไปใส่ใน GitHub OAuth App ช่อง Redirect URI เป๊ะๆ แล้วกด Update",
  });
}
