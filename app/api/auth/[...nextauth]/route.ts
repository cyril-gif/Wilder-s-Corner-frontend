import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

<<<<<<< HEAD
// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    }
  }
  interface User {
    id: string;
    email: string;
    name: string;
  }
}

=======
>>>>>>> 33ffe284153b2fb358e8a84d926d8ab47b59b2fc
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const res = await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
          const user = res.data.data;
          if (user) {
            return {
              id: user._id,
              email: user.email,
              name: user.name,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/social-login`, {
            email: user.email,
            name: user.name,
            provider: account.provider,
          });
<<<<<<< HEAD
          if (res.data.success) {
            return true;
          }
          return false;
=======
          user.id = res.data.data._id;
          return true;
>>>>>>> 33ffe284153b2fb358e8a84d926d8ab47b59b2fc
        } catch (error) {
          console.error("Social login error:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
<<<<<<< HEAD

=======
>>>>>>> 33ffe284153b2fb358e8a84d926d8ab47b59b2fc
