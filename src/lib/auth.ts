import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

// Dev secret for local development
const DEV_SECRET =
  "greentera-dev-secret-change-in-production-12345678901234567890";

// Helper function to add timeout to database queries
async function queryWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 5000
): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Database query timeout (${timeoutMs}ms)`)),
        timeoutMs
      )
    ),
  ]).catch((err) => {
    console.error(
      "Query timeout or error:",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  });
}

const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                role: "USER",
              };
            },
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password diperlukan");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Database only - no mock users
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Email atau password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth, ensure user exists in database
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await queryWithTimeout(
            prisma.user.findUnique({
              where: { email: user.email },
            }),
            5000
          );

          if (!existingUser) {
            // Create new user with default gamification stats
            const created = await queryWithTimeout(
              prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || "User",
                  image: user.image,
                  role: "USER",
                  points: 0,
                },
              }),
              5000
            );
            if (!created) {
              console.error("❌ Failed to create user - timeout");
              return false;
            }
          } else if (!existingUser.image && user.image) {
            // Update image if user exists but doesn't have one
            await queryWithTimeout(
              prisma.user.update({
                where: { email: user.email },
                data: { image: user.image },
              }),
              5000
            );
          }
          return true;
        } catch (error) {
          console.error(
            "❌ Google Auth Error - signIn:",
            error instanceof Error ? error.message : String(error)
          );
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // For Google OAuth, get the database user ID
      if (account?.provider === "google" && user?.email) {
        try {
          const dbUser = await queryWithTimeout(
            prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, role: true },
            }),
            5000
          );
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          } else {
            console.error(
              "❌ User not found in database after Google login:",
              user.email
            );
            // Fallback: use email as ID if database query failed/timeout
            token.id = user.email;
            token.role = "USER";
          }
        } catch (error) {
          console.error(
            "❌ JWT callback error:",
            error instanceof Error ? error.message : String(error)
          );
          // Still return token to prevent complete failure
          token.id = user.email;
          token.role = "USER";
        }
      } else if (user) {
        // For credentials login
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || DEV_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
