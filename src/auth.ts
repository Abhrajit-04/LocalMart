import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import connectDb from "@/lib/db"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb()

        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error("Invalid email or password")

        const ismatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        )

        if (!ismatch) throw new Error("Invalid email or password")

        return {
          id: user._id.toString(), // ✅ Mongo ID
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile: any) {
        return {
          id: profile.email, // ✅ temporary
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await connectDb()

      let dbUser = await User.findOne({ email: user.email })

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: "user",
        })
      }

      // ✅ IMPORTANT: force Mongo ID
      user.id = dbUser._id.toString()

      ;(user as any).role = dbUser.role

      return true
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = (user as any).role
        token.image = user.image
      }

      if (trigger === "update") {
        token.role = session?.role
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
        session.user.image = token.image as string
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
})