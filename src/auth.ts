import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// GitHub OAuth จะเปิดใช้งานก็ต่อเมื่อตั้งค่า env ครบ
// (ดูวิธีตั้งค่าใน README ส่วน "Login ด้วย GitHub")
const providers = [];
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
});
