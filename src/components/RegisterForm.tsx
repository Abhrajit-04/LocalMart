import {
  ArrowLeft,
  Store,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Sparkles,
} from 'lucide-react'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import googleImage from '@/assets/google.png'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

type propType = {
  previousStep: (s: number) => void
}

function RegisterForm({ previousStep }: propType) {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== ''

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formValid) return

    setLoading(true)
    setError('')

    try {
      await axios.post('/api/auth/register', {
        name,
        email,
        password,
      })

      router.push('/login')
    } catch (error) {
      setError('Registration failed')
    }

    setLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-100 via-cyan-100 to-orange-100 flex items-center justify-center px-4 py-10">

      {/* Blur Background */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-green-400/30 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" />


      {/* Back Button Outside Card */}
<button
  onClick={() => previousStep(1)}
  className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/85 via-cyan-500/80 to-blue-500/85 backdrop-blur-2xl border border-white/30 shadow-[0_14px_35px_rgba(16,185,129,0.28)] text-white hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-[0_18px_45px_rgba(59,130,246,0.35)] transition-all duration-300"
>
  <ArrowLeft className="w-5 h-5" />
  <span className="text-sm font-semibold tracking-wide">Back</span>
</button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/40 bg-white/35 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.14)] px-8 md:px-10 py-9"
      >

       

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500 flex items-center justify-center shadow-xl">
            <Store className="text-white w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-8">
          Join <span className="text-emerald-600 font-semibold">LoKart</span> Today
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-400/70 bg-white/55 text-gray-800 placeholder:text-gray-500 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400/70 bg-white/55 text-gray-800 placeholder:text-gray-500 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400/70 bg-white/55 text-gray-800 placeholder:text-gray-500 rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
            />

            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-4 top-4 w-5 h-5 text-gray-600 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(true)}
                className="absolute right-4 top-4 w-5 h-5 text-gray-600 cursor-pointer"
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          {/* Register Button */}
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
                Register
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

        {/* Google */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full rounded-2xl border border-white/50 bg-white/55 py-3 text-gray-700 font-medium flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/75 hover:scale-[1.01] shadow-sm"
        >
          <Image src={googleImage} alt="google" width={20} height={20} />
          Continue with Google
        </button>

        {/* Login */}
        <p
          onClick={() => router.push('/login')}
          className="mt-7 text-center text-sm text-gray-700 cursor-pointer hover:text-emerald-600 transition"
        >
          Already have an account?{' '}
          <span className="font-semibold">Sign in</span>
        </p>

        {/* Badge */}
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

export default RegisterForm