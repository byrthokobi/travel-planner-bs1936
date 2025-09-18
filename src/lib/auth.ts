import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {PrismaAdapter} from "@auth/prisma-adapter"


export const { auth, handlers, signIn } = NextAuth({
    // adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }), 
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async(credentials) => {
                const email = credentials?.email as string;
                const password = credentials?.password as string;
                
                if (!email || !password) {
                    throw new Error("Missing email or password");
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error("Invalid email format.");
                }

                const user = await prisma.user.findFirst({
                    where: { email: email},
                });

                if(!user) {
                    throw new Error("Invalid Credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password as string
                );

                if (!isPasswordValid) {
                    throw new Error("Incorrect email or password");
                }
                
                return { id: user.id.toString(), email: user.email, name: user.fullname ?? null };
            }
        }),

    ],
    callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});