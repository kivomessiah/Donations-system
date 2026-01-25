"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-200 opacity-20 filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-200 opacity-20 filter blur-3xl animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4"
                    >
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
                    <p className="text-gray-600 font-medium">نظام إدارة التبرعات والمصروفات</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-black mb-2 mr-1">البريد الإلكتروني</label>
                        <input
                            name="email"
                            type="email"
                            required
                            dir="ltr"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all placeholder:text-gray-400 bg-white/50 font-bold text-black"
                            placeholder="mail@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black mb-2 mr-1">كلمة المرور</label>
                        <input
                            name="password"
                            type="password"
                            required
                            dir="ltr"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all placeholder:text-gray-400 bg-white/50 font-bold text-black"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-red-700 text-sm font-bold flex items-center gap-2 animate-shake">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            {state.error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                        {isPending ? (
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>دخول للنظام</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <Link
                            href="/register"
                            className="text-indigo-700 font-extrabold hover:text-indigo-900 underline-offset-4 hover:underline transition-all"
                        >
                            ليس لديك حساب؟ طلب انضمام جديد
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
