"use client";

import { useActionState, useEffect, useRef } from "react";
import { addTransaction } from "@/actions/transactions";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader2, CheckCircle } from "lucide-react";

export default function TransactionForm() {
    const [state, formAction, isPending] = useActionState(addTransaction, null);
    const formRef = useRef<HTMLFormElement>(null);

    // Reset form on success
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <PlusCircle className="text-indigo-600" />
                    تسجيل جديد
                </h2>
            </div>

            <form ref={formRef} action={formAction} className="p-6 space-y-6">

                {/* Type Selection */}
                <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">نوع العملية</label>
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-xl relative">
                        <label className="flex-1 relative cursor-pointer group">
                            <input type="radio" name="type" value="DONATION" defaultChecked className="peer sr-only" />
                            <div className="text-center py-2 rounded-lg text-gray-600 peer-checked:bg-white peer-checked:text-indigo-700 peer-checked:shadow-sm transition-all font-bold z-10 relative">تـبـرع</div>
                        </label>
                        <label className="flex-1 relative cursor-pointer group">
                            <input type="radio" name="type" value="EXPENSE" className="peer sr-only" />
                            <div className="text-center py-2 rounded-lg text-gray-600 peer-checked:bg-white peer-checked:text-red-700 peer-checked:shadow-sm transition-all font-bold z-10 relative">مـصـروف</div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-base font-bold text-gray-900 mb-2">الاسم / البند</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none font-bold text-gray-900"
                            placeholder="مثال: فلان الفلاني"
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-base font-bold text-gray-900 mb-2">المبلغ</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            required
                            min="1"
                            step="0.01"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none font-bold text-gray-900"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Payment Method - Conditional logic handled purely by CSS/JS or just show it (it's optional in schema) */}
                {/* For simplicity in this iteration, we show it, but maybe we can hide it for Expense via simple CSS peer-checked logic if strictly needed, but let's keep it visible or generic */}
                <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">طريقة الدفع (للتبرعات)</label>
                    <select
                        name="paymentMethod"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none bg-white font-bold text-gray-900"
                    >
                        <option value="CASH">نقـدي (Cash)</option>
                        <option value="BANK">تحويل بنكي</option>
                        <option value="MOBILE">موبايل كاش</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="notes" className="block text-base font-bold text-gray-900 mb-2">ملاحظات (اختياري)</label>
                    <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none font-bold text-gray-900"
                        placeholder="أي تفاصيل إضافية..."
                    />
                </div>


                <AnimatePresence>
                    {state?.error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm"
                        >
                            {state.error}
                        </motion.div>
                    )}
                    {state?.success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-green-50 text-green-600 p-3 rounded-xl text-center text-sm flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} />
                            {state.message}
                        </motion.div>
                    )}
                </AnimatePresence>


                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : (
                        "حفظ العملية"
                    )}
                </button>

            </form>
        </motion.div>
    );
}
