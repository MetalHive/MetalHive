"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const router = useRouter()
    const { login, isLoading, error: authError, user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Client-side validation
        const newErrors: { email?: string; password?: string } = {}
        if (!email) newErrors.email = 'Email is required'
        if (!password) newErrors.password = 'Password is required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})

        try {
            await login({ email, password })

            // Redirect based on user role (handled in useAuth, but doublecheck here)
            if (user?.role === 'SELLER') {
                router.push('/sellerDashBoard')
            } else if (user?.role === 'BUYER') {
                router.push('/buyersDashboard')
            } else {
                router.push('/sellerDashBoard') // default
            }
        } catch (err) {
            console.error('Login failed:', err)
            // Error will be shown via authError
        }
    }

    return (
        <div className="min-h-screen flex flex-col px-4 py-10">
            {/* Logo */}
            <Image
                src="/logoBlack.png"
                width={90}
                height={90}
                alt="MetalHive black logo"
            />

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-[#17181A] mb-2">Welcome Back</h2>
                    <p className="text-[#737780] mb-6">Sign in to your account to continue</p>

                    {/* Show API error if any */}
                    {authError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                        {/* Email Field */}
                        <label className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
                            <div className="mb-2 text-lg pt-2 pl-2 font-medium">Email</div>
                            <div className="bg-white p-4">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-yellow-300'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </label>

                        {/* Password Field */}
                        <label className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
                            <div className="mb-2 text-lg pt-2 pl-2 font-medium">Password</div>
                            <div className="bg-white p-4 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-yellow-300'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </button>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </label>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#C9A227] text-white hover:border-[#C9A227] hover:border-2 hover:bg-white hover:text-[#C9A227] font-semibold px-6 py-3 rounded-lg transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-sm text-center text-[#666666]">
                            Don't have an account?{' '}
                            <Link href="/auth" className="text-[#C9A227] font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn
