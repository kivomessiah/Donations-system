"use client";

import { useState } from "react";
import { verifyAdminPassword } from "@/actions/auth";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsPending(true);
        setError("");

        try {
            const result = await verifyAdminPassword(password);
            if (result.success) {
                setIsAuthorized(true);
            } else {
                setError(result.error || "خطأ غير متوقع");
            }
        } catch (err) {
            setError("حدث خطأ في الاتصال بالسيرفر");
        } finally {
            setIsPending(false);
        }
    }

    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 text-center"
            >
                <div className="mx-auto w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <Lock size={40} />
                </div>

                <h2 className="text-2xl font-black text-black mb-2">منطقة محمية</h2>
                <p className="text-gray-500 mb-8">يرجى إدخال كلمة المرور الخاصة بك للمتابعة إلى إدارة المستخدمين</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="كلمة المرور"
                        required
                        autoFocus
                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-center text-xl font-bold"
                    />

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="flex items-center gap-2 text-red-600 font-bold justify-center"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-black hover:bg-gray-800 text-white font-black py-4 rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : "تأكيد الهوية"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
