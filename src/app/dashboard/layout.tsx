import { getSession } from "@/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/actions/auth";
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { ReactNode } from "react";

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await getSession();
    const user = session.user;

    if (!user || !user.isLoggedIn) {
        redirect("/login");
    }

    // RBAC: Define menu items based on roles
    const menuItems = [
        {
            name: "لوحة التحكم",
            href: "/dashboard",
            icon: LayoutDashboard,
            roles: ["ADMIN", "FINANCE"],
        },
        {
            name: "إضافة عملية",
            href: "/dashboard/transactions/new",
            icon: PlusCircle,
            roles: ["ADMIN", "FINANCE", "ENTRY"],
        },
        {
            name: "التقارير",
            href: "/dashboard/reports",
            icon: FileText,
            roles: ["ADMIN", "FINANCE"],
        },
        {
            name: "المستخدمين",
            href: "/dashboard/users",
            icon: Settings,
            roles: ["ADMIN"],
        },
    ];

    const allowedItems = menuItems.filter((item) =>
        item.roles.includes(user.role)
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row " dir="rtl">
            {/* Mobile Header */}
            <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center">
                <div className="font-bold text-lg text-indigo-600">جمعية الخير</div>
                {/* Mobile Menu Toggle would go here - simplified for server component */}
            </div>

            {/* Sidebar - Hidden on mobile for now (simple version) */}
            <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col z-10 h-screen sticky top-0">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                        نظام التبرعات
                    </h2>
                    <p className="text-sm text-gray-700 font-bold mt-1">مرحباً، {user.name}</p>
                    <span className="text-xs inline-block bg-indigo-100 text-indigo-900 font-extrabold px-2 py-1 rounded-full mt-2">
                        {user.role}
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {allowedItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-800 transition-all group"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform text-gray-600 group-hover:text-indigo-700" />
                            <span className="font-bold">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 rounded-xl hover:bg-red-50 transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            تسجيل خروج
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
