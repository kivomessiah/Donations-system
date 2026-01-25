"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { motion } from "framer-motion";

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
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-gray-900 mb-2"
                        >
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white text-gray-900 font-medium placeholder-gray-400"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-bold text-gray-900 mb-2"
                        >
                            كلمة المرور
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white text-gray-900 font-medium placeholder-gray-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md"
                        >
                            {state.error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? "جاري التسجيل..." : "دخول"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
