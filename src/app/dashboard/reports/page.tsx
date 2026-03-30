import TransactionList from "@/components/TransactionList";
import prisma from "@/lib/prisma";
import { getSession } from "@/actions/auth";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
    const session = await getSession();
    const { month } = await searchParams;

    const where: any = {};

    if (month) {
        const firstDay = new Date(`${month}-01`);
        const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
        where.date = {
            gte: firstDay,
            lte: lastDay,
        };
    }

    // Security: Only Admins can see retracted (inactive) transactions
    if (session.user?.role !== "ADMIN") {
        where.isActive = true;
    }

    // Fetch all transactions, ordered by newest first
    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: {
            date: 'desc'
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">التقارير التفصيلية</h1>
                    <p className="text-gray-500 mt-1 font-medium">عرض وتصفية جميع العمليات المسجلة</p>
                </div>
            </div>

            <TransactionList transactions={transactions} userRole={session.user?.role} />
        </div>
    );
}
