"use client";

import { useActionState, useState } from "react";
import { registerUser } from "@/actions/users";
import { ArrowRight, UserPlus, Shield, User as UserIcon, Wallet, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(registerUser, null);
    const [successMessage, setSuccessMessage] = useState("");

    if (state?.success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-[family-name:var(--font-cairo)]" dir="rtl">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <UserPlus size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-black">تم استلام طلبك!</h1>
                    <p className="text-black font-bold text-lg leading-relaxed">
                        شكراً لتسجيلك. حسابك الآن **قيد الانتظار**. يرجى التواصل مع المسؤول لتفعيل حسابك.
                    </p>
                    <Link
                        href="/login"
                        className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-indigo-700 transition-all"
                    >
                        العودة للدخول
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-[family-name:var(--font-cairo)]" dir="rtl">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-black">طلب انضمام جديد</h1>
                    <p className="text-black font-bold mt-2">نظام إدارة التبرعات - 5dma Community</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-black text-black mb-2 mr-1">الاسم الكامل</label>
                        <input
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-black"
                            placeholder=""
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-black text-black mb-2 mr-1">اسم المستخدم (الإيميل)</label>
                        <div className="flex gap-2 items-center">
                            <input
                                name="email"
                                required
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-black"
                                placeholder=""
                            />
                            <span className="font-black text-indigo-700 bg-indigo-50 px-3 py-3 rounded-xl border border-indigo-100">@admin.com</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-black mb-2 mr-1">الصلاحية المطلوبة</label>
                        <select
                            name="role"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none font-black text-black bg-white"
                        >
                            <option value="VIEWER">مشاهد (Viewer) - عرض فقط</option>
                            <option value="ENTRY">مدخل بيانات (Entry)</option>
                            <option value="ADMIN">مدير (Admin)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-black mb-2 mr-1">كلمة المرور</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-black"
                            placeholder=""
                        />
                    </div>

                    {state?.error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-black border border-red-100">
                            {state.error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
                    >
                        {isPending ? "جاري الإرسال..." : "إرسال الطلب"}
                    </button>

                    <div className="text-center pt-2">
                        <Link href="/login" className="text-indigo-700 font-black hover:underline">
                            لديك حساب بالفعل؟ سجل دخول
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
