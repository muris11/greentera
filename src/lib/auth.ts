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
      // For Google OAuth, skip database check for now - just allow signin
      // Database operations will happen in JWT callback if needed
      if (account?.provider === "google") {
        console.log("✅ Google OAuth signIn - user:", user.email);
        return true; // Allow signin immediately
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // For Google OAuth, create/get user from database
      if (account?.provider === "google" && user?.email) {
        try {
          // Try to find or create user
          let dbUser = await queryWithTimeout(
            prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, role: true },
            }),
            3000
          );

          // If not found, create new user
          if (!dbUser) {
            console.log("Creating new user from Google OAuth:", user.email);
            dbUser = await queryWithTimeout(
              prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name || "User",
                  image: user.image,
                  role: "USER",
                  points: 0,
                },
              }),
              3000
            );
          } else if (!dbUser.id) {
            // If ID is missing, use email as temporary ID
            console.warn("User found but ID missing, using email as ID");
            dbUser.id = user.email;
          }

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role || "USER";
            token.email = user.email;
          }
        } catch (error) {
          console.error(
            "⚠️ JWT callback database error:",
            error instanceof Error ? error.message : String(error)
          );
          // Fallback - use email as ID if database fails
          token.id = user.email;
          token.email = user.email;
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
