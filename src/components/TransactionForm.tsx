"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addTransaction } from "@/actions/transactions";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function TransactionForm() {
    const [state, formAction, isPending] = useActionState(addTransaction, null);
    const formRef = useRef<HTMLFormElement>(null);
    const [type, setType] = useState('DONATION');

    // Reset form on success
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
            setType('DONATION');
        }
    }, [state?.success]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border-2 border-gray-100 overflow-hidden"
        >
            <div className="p-8 border-b border-gray-100 bg-slate-50">
                <h2 className="text-3xl font-black text-black flex items-center gap-3">
                    <PlusCircle className="text-indigo-600 w-8 h-8" />
                    تسجيل عملية جديدة
                </h2>
            </div>

            <form ref={formRef} action={formAction} className="p-8 space-y-8">
                {/* Type Selection */}
                <div>
                    <label className="block text-lg font-black text-black mb-3 mr-1">نوع العملية</label>
                    <div className="flex gap-4 p-2 bg-gray-100 rounded-2xl relative">
                        <label className="flex-1 relative cursor-pointer group">
                            <input
                                type="radio"
                                name="type"
                                value="DONATION"
                                checked={type === 'DONATION'}
                                onChange={(e) => setType(e.target.value)}
                                className="peer sr-only"
                            />
                            <div className="text-center py-4 rounded-xl text-black/60 peer-checked:bg-white peer-checked:text-indigo-700 peer-checked:shadow-xl transition-all font-black z-10 relative text-lg">تـبـرع</div>
                        </label>
                        <label className="flex-1 relative cursor-pointer group">
                            <input
                                type="radio"
                                name="type"
                                value="EXPENSE"
                                checked={type === 'EXPENSE'}
                                onChange={(e) => setType(e.target.value)}
                                className="peer sr-only"
                            />
                            <div className="text-center py-4 rounded-xl text-black/60 peer-checked:bg-white peer-checked:text-red-700 peer-checked:shadow-xl transition-all font-black z-10 relative text-lg">مـصـروف</div>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-lg font-black text-black mb-2 mr-1">الاسم / البيان</label>
                    <input
                        name="name"
                        required
                        placeholder="مثال: تبرع فاعل خير / شراء كراسي"
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-black placeholder:text-gray-300 text-xl"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-lg font-black text-black mb-2 mr-1">المبلغ (ج.م)</label>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            required
                            placeholder="0"
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-black text-xl"
                        />
                    </div>

                    <div className={type === 'EXPENSE' ? 'opacity-30 pointer-events-none' : ''}>
                        <label className="block text-lg font-black text-black mb-2 mr-1">طريقة الدفع</label>
                        <select
                            name="paymentMethod"
                            disabled={type === 'EXPENSE'}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-black bg-white text-xl appearance-none"
                        >
                            <option value="CASH">نقدي (Cash)</option>
                            <option value="BANK">تحويل بنكي (Bank)</option>
                            <option value="MOBILE">محفظة إلكترونية (Mobile)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-lg font-black text-black mb-2 mr-1">ملاحظات إضافية (اختياري)</label>
                    <textarea
                        name="notes"
                        rows={3}
                        placeholder=""
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-black placeholder:text-gray-300 text-xl"
                    ></textarea>
                </div>

                <AnimatePresence>
                    {state?.error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-red-50 text-red-700 p-5 rounded-2xl text-center font-black border-2 border-red-100 flex items-center justify-center gap-3"
                        >
                            <AlertCircle size={24} />
                            {state.error}
                        </motion.div>
                    )}
                    {state?.success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-green-50 text-green-700 p-5 rounded-2xl text-center font-black border-2 border-green-100 flex items-center justify-center gap-3"
                        >
                            <CheckCircle size={24} />
                            {state.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-indigo-100 transform transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 text-2xl"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin w-8 h-8" />
                            جاري الحفظ...
                        </>
                    ) : (
                        "حفظ العملية الآن"
                    )}
                </button>
            </form>
        </motion.div>
    );
}
