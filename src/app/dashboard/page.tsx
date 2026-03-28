import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import MonthSelector from "@/components/MonthSelector";

async function getStats(month?: string) {
    const now = new Date();
    let firstDay, lastDay;

    if (month) {
        firstDay = new Date(`${month}-01`);
        lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
    } else {
        firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // 1. Lifetime Total Balance (Wallet)
    const totalDonations = await prisma.transaction.aggregate({
        where: { type: "DONATION", isActive: true },
        _sum: { amount: true }
    });
    const totalExpenses = await prisma.transaction.aggregate({
        where: { type: "EXPENSE", isActive: true },
        _sum: { amount: true }
    });
    const walletBalance = (totalDonations._sum.amount || 0) - (totalExpenses._sum.amount || 0);

    // 2. Monthly Stats
    const monthlyDonations = await prisma.transaction.aggregate({
        where: {
            type: "DONATION",
            isActive: true,
            date: {
                gte: firstDay,
                lte: lastDay,
            }
        },
        _sum: {
            amount: true,
        }
    });

    const monthlyExpenses = await prisma.transaction.aggregate({
        where: {
            type: "EXPENSE",
            isActive: true,
            date: {
                gte: firstDay,
                lte: lastDay,
            }
        },
        _sum: {
            amount: true,
        }
    });

    return {
        walletBalance,
        monthlyDonations: monthlyDonations._sum.amount || 0,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        lifetimeDonations: totalDonations._sum.amount || 0,
        lifetimeExpenses: totalExpenses._sum.amount || 0,
    };
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
    const session = await getSession();
    if (session.user?.role === "ENTRY") {
        // Entry role defaults to adding transactions
        redirect("/dashboard/transactions/new");
    }

    const { month } = await searchParams;
    const stats = await getStats(month);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
                    <p className="text-gray-500 mt-2">نظرة عامة على محفظة التبرعات والمصروفات</p>
                </div>
                <MonthSelector />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Monthly Donations Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-black font-black text-lg">تبرعات الشهر</h3>
                    </div>
                    <p className="text-3xl font-black text-black">{stats.monthlyDonations.toLocaleString()} ج.م</p>
                </div>

                {/* Monthly Expenses Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingDown size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
                            <TrendingDown size={24} />
                        </div>
                        <h3 className="text-black font-black text-lg">مصروفات الشهر</h3>
                    </div>
                    <p className="text-3xl font-black text-black">{stats.monthlyExpenses.toLocaleString()} ج.م</p>
                </div>

                {/* Wallet Balance Card (Lifetime) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                            <Wallet size={24} />
                        </div>
                        <h3 className="text-black font-black text-lg">الرصيد الحالي</h3>
                    </div>
                    <p className="text-3xl font-black text-black">{stats.walletBalance.toLocaleString()} ج.م</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Lifetime Donations Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-black font-black text-lg">إجمالي التبرعات</h3>
                    </div>
                    <p className="text-3xl font-black text-black">{stats.lifetimeDonations.toLocaleString()} ج.م</p>
                </div>

                {/* Lifetime Expenses Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingDown size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                            <TrendingDown size={24} />
                        </div>
                        <h3 className="text-black font-black text-lg">إجمالي المصروفات</h3>
                    </div>
                    <p className="text-3xl font-black text-black">{stats.lifetimeExpenses.toLocaleString()} ج.م</p>
                </div>
            </div>

            {/* Recent Activity Section could go here */}
        </div>
    );
}
