import prisma from "@/lib/prisma";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import { Shield, User as UserIcon, Wallet } from "lucide-react";

export default async function UsersPage() {
    const session = await getSession();

    // Strict RBAC Check
    if (session.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">إدارة المستخدمين</h1>
                <p className="text-gray-500 mt-2">قائمة بجميع المسؤولين وصلاحياتهم</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="p-4">الاسم</th>
                            <th className="p-4">البريد الإلكتروني</th>
                            <th className="p-4">الصلاحية</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.email} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                <td className="p-4 text-gray-500">{user.email}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'FINANCE' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role === 'ADMIN' && <Shield size={14} />}
                                        {user.role === 'FINANCE' && <Wallet size={14} />}
                                        {user.role === 'ENTRY' && <UserIcon size={14} />}
                                        {user.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
