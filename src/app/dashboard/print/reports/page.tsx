import prisma from "@/lib/prisma";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function PrintReportsPage() {
    const session = await getSession();
    if (!session.user?.isLoggedIn) redirect("/login");

    const transactions = await prisma.transaction.findMany({
        orderBy: { date: 'desc' },
        where: { isActive: true } // Only active for print? Or all? Let's say all for audit, but maybe active mostly.
    });

    return (
        <div className="p-8 bg-white min-h-screen text-black" dir="rtl">
            <div className="text-center mb-8 border-b pb-4">
                <h1 className="text-2xl font-bold">تقرير التبرعات والمصروفات</h1>
                <p className="text-sm mt-1">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
            </div>

            <table className="w-full text-right border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">التاريخ</th>
                        <th className="border border-gray-300 p-2">النوع</th>
                        <th className="border border-gray-300 p-2">الاسم</th>
                        <th className="border border-gray-300 p-2">المبلغ</th>
                        <th className="border border-gray-300 p-2">ملاحظات</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t.id}>
                            <td className="border border-gray-300 p-2">{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                            <td className="border border-gray-300 p-2">{t.type === 'DONATION' ? 'تبرع' : 'مصروف'}</td>
                            <td className="border border-gray-300 p-2">{t.name}</td>
                            <td className="border border-gray-300 p-2">{t.amount.toLocaleString()}</td>
                            <td className="border border-gray-300 p-2">{t.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-8 flex justify-between text-sm">
                <div>توقيع المحاسب: ....................</div>
                <div>توقيع المدير: ....................</div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: 'window.print()' }} />
        </div>
    );
}
