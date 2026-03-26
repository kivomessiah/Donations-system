"use client";

import { toggleTransactionStatus } from "@/actions/deleteTransaction";
import { useRouter } from "next/navigation";
import { Trash2, Undo2, Filter, Search } from "lucide-react";
import { useState } from "react";
import MonthSelector from "./MonthSelector";

type Transaction = {
    id: string;
    date: Date;
    type: string;
    name: string;
    amount: number;
    isActive: boolean;
    paymentMethod: string | null;
    enteredBy: string;
};

export default function TransactionList({
    transactions,
    userRole,
}: {
    transactions: Transaction[];
    userRole?: string;
}) {
    const router = useRouter();
    const [filterType, setFilterType] = useState("ALL");
    const [search, setSearch] = useState("");

    const isViewer = userRole === "VIEWER" || userRole === "RESTRICTED";
    const isRestricted = userRole === "RESTRICTED";

    const handleToggle = async (id: string) => {
        if (confirm("هل أنت متأكد من تغيير حالة السجل؟")) {
            await toggleTransactionStatus(id);
            router.refresh();
        }
    };

    const filtered = transactions.filter(t => {
        const matchType = filterType === "ALL" || t.type === filterType;
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-3.5 text-black" size={20} />
                    <input
                        type="text"
                        placeholder="بحث بالاسم..."
                        className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-indigo-600 font-black text-black text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={isRestricted}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType("ALL")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        الكل
                    </button>
                    <button
                        onClick={() => setFilterType("DONATION")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'DONATION' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        تبرعات
                    </button>
                    <button
                        onClick={() => setFilterType("EXPENSE")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'EXPENSE' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        مصروفات
                    </button>
                </div>

                <div className="flex gap-2">
                    <MonthSelector />
                    <a
                        href="/dashboard/print/reports"
                        target="_blank"
                        className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        طباعة
                    </a>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-900 text-white font-black">
                            <tr>
                                <th className="p-5">التاريخ</th>
                                <th className="p-5">النوع</th>
                                <th className="p-5">الاسم / البند</th>
                                <th className="p-5">المبلغ</th>
                                <th className="p-5">طريقة الدفع</th>
                                <th className="p-5">المسؤول</th>
                                <th className="p-5">الحالة</th>
                                {!isViewer && <th className="p-5">إجراءات</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-10 text-center text-black font-black text-lg">لا توجد بيانات</td>
                                </tr>
                            ) : filtered.map((t) => (
                                <tr key={t.id} className={`hover:bg-indigo-50/30 transition-colors ${!t.isActive ? 'opacity-40 bg-gray-50' : ''}`}>
                                    <td className="p-5 text-black font-bold whitespace-nowrap">
                                        {new Date(t.date).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="p-5 font-black">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-black ${t.type === 'DONATION' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                                            }`}>
                                            {t.type === 'DONATION' ? 'تبرع' : 'مصروف'}
                                        </span>
                                    </td>
                                    <td className="p-5 font-black text-black text-lg">
                                        {isRestricted && t.type === 'DONATION' ? 'فاعل خير' : t.name}
                                    </td>
                                    <td className="p-5 font-black text-black text-lg">{t.amount.toLocaleString()}</td>
                                    <td className="p-5 text-black font-black">
                                        {t.type === 'DONATION' ? (
                                            <span className="bg-indigo-100 text-indigo-900 px-2 py-1 rounded-lg text-xs font-black">
                                                {t.paymentMethod === 'CASH' && 'نقدي'}
                                                {t.paymentMethod === 'BANK' && 'بنكي'}
                                                {t.paymentMethod === 'MOBILE' && 'موبايل'}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="p-5 text-black font-bold">
                                        {isRestricted ? '-' : t.enteredBy?.split('@')[0]}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black ${t.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-200 text-gray-700 border border-gray-300'
                                            }`}>
                                            {t.isActive ? 'نشط' : 'ملغي'}
                                        </span>
                                    </td>
                                    {!isViewer && (
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggle(t.id)}
                                                className={`p-2 rounded-lg transition-colors ${t.isActive
                                                    ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                                                    : 'text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600'
                                                    }`}
                                                title={t.isActive ? "إلغاء السجل" : "استعادة السجل"}
                                            >
                                                {t.isActive ? <Trash2 size={18} /> : <Undo2 size={18} />}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
