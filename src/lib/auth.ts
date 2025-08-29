import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {PrismaAdapter} from "@auth/prisma-adapter"


export const { auth, handlers, signIn } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt", // default in NextAuth v5, but set explicitly
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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
                const user = await prisma.user.findFirst({
                    where: { email: credentials.email as string},
                });

                if(!user) {
                    throw new Error("Invalid Credentials");
                }

                // const isPasswordValid = await bcrypt.compare(
                //     credentials.password as string,
                //     user.password as string
                // );

                // if (!isPasswordValid) {
                //     throw new Error("Invalid password");
                // }
                
                return { id: user.id, email: user.email, name: user.fullname ?? null };
            }
        }),
    ],
    callbacks: {
    async jwt({ token, user }) {
      // When user logs in, persist their info in token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Make token fields available in session.user
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});