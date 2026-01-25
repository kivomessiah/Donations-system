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

    // This aggregation relies on our Transaction model
    // We need to group by type
    const donations = await prisma.transaction.aggregate({
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

    const expenses = await prisma.transaction.aggregate({
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
        donations: donations._sum.amount || 0,
        expenses: expenses._sum.amount || 0,
        balance: (donations._sum.amount || 0) - (expenses._sum.amount || 0)
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
                    <p className="text-gray-500 mt-2">نظرة عامة على التبرعات والمصروفات</p>
                </div>
                <MonthSelector />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Donation Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-gray-500 font-medium">إجمالي التبرعات</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.donations.toLocaleString()} ج.م</p>
                </div>

                {/* Expense Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingDown size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <TrendingDown size={24} />
                        </div>
                        <h3 className="text-gray-500 font-medium">إجمالي المصروفات</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.expenses.toLocaleString()} ج.م</p>
                </div>

                {/* Balance Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <h3 className="text-gray-500 font-medium">الرصيد المتبقي</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.balance.toLocaleString()} ج.م</p>
                </div>
            </div>

            {/* Recent Activity Section could go here */}
        </div>
    );
}
