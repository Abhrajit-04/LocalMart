'use client'

import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Sparkles,
} from 'lucide-react'

import React, { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import googleImage from '@/assets/google.png'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formValid = email.trim() !== '' && password.trim() !== ''

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    if (!formValid) return

    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      setError('Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-100 via-cyan-100 to-orange-100 flex items-center justify-center px-4 py-10">

      {/* Liquid Blur Background */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-green-400/30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" />

      {/* Login Card */}
      {/* Login Card */}
<motion.div
  initial={{ opacity: 0, y: 35, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.55 }}
  className="relative z-10 w-full max-w-xl rounded-[2rem]
  border border-white/40 bg-white/30 backdrop-blur-2xl
  shadow-[0_25px_70px_rgba(0,0,0,0.14)]
  px-8 md:px-10 py-9"
>
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500 flex items-center justify-center shadow-xl">
            <Store className="text-white w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-8">
          Login to <span className="text-emerald-600 font-semibold">LoKart</span>
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400/70 bg-white/55 text-gray-800 placeholder:text-gray-500 rounded-2xl px-5 py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400/70 bg-white/55 text-gray-800 placeholder:text-gray-500 rounded-2xl px-5 py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
            />

            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-4 top-3.5 w-5 h-5 text-gray-600 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(true)}
                className="absolute right-4 top-3.5 w-5 h-5 text-gray-600 cursor-pointer"
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            disabled={!formValid || loading}
            className={`w-full rounded-2xl py-3 font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              formValid
                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 hover:scale-[1.02] hover:shadow-emerald-300'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
  <div className="h-px flex-1 bg-gray-400/60"></div>

  <span className="text-gray-600 text-sm font-medium tracking-[0.25em] uppercase">
    OR
  </span>

  <div className="h-px flex-1 bg-gray-400/60"></div>
</div>

        {/* Google Login */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full rounded-2xl border border-white/50 bg-white/55 py-3 text-gray-700 font-medium flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/75 hover:scale-[1.01] shadow-sm"
        >
          <Image src={googleImage} alt="google" width={20} height={20} />
          Continue with Google
        </button>

        {/* Register */}
        <p
          onClick={() => router.push('/register')}
          className="mt-7 text-center text-sm text-gray-700 cursor-pointer hover:text-emerald-600 transition"
        >
          Don&apos;t have an account?{' '}
          <span className="font-semibold">Sign Up</span>
        </p>

        {/* Tiny badge */}
        <div className="mt-5 flex justify-center">
          <span className="text-xs px-3 py-1 rounded-full bg-white/50 text-gray-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Trusted Local Marketplace
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default Login