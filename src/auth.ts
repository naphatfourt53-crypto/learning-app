import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const clean = (v: string | undefined) => v?.trim();

// GitHub OAuth จะเปิดใช้งานก็ต่อเมื่อตั้งค่า env ครบ
// (ดูวิธีตั้งค่าใน README ส่วน "Login ด้วย GitHub")
const clientId = clean(process.env.AUTH_GITHUB_ID);
const clientSecret = clean(process.env.AUTH_GITHUB_SECRET);
const secret = clean(process.env.AUTH_SECRET);

const providers = [];
if (clientId && clientSecret) {
  providers.push(GitHub({ clientId, clientSecret }));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  // ส่ง secret ที่ trim แล้วเอง ป้องกันช่องว่าง/ขึ้นบรรทัดใหม่ติดมาตอนก็อปวาง
  ...(secret ? { secret } : {}),
  trustHost: true,
});
