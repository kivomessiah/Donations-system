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
            roles: ["ADMIN", "FINANCE", "VIEWER", "RESTRICTED"],
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
            roles: ["ADMIN", "FINANCE", "VIEWER", "RESTRICTED"],
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
            <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">خ</div>
                    <div className="font-bold text-lg text-black">نظام التبرعات</div>
                </div>
                <form action={logout}>
                    <button type="submit" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-6 h-6" />
                    </button>
                </form>
            </div>

            {/* Sidebar - Desktop only */}
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
                            className="flex items-center gap-3 px-4 py-3 text-black font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all group"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform text-black group-hover:text-white" />
                            <span className="font-black">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-4 py-3 w-full text-red-700 rounded-xl hover:bg-red-50 transition-all font-black"
                        >
                            <LogOut className="w-5 h-5" />
                            تسجيل خروج
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-[72px] z-50 px-2 pb-safe shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
                {allowedItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center justify-center flex-1 h-full text-black font-bold transition-all active:scale-90"
                    >
                        <div className="p-1 rounded-xl transition-colors">
                            <item.icon className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-[10px] sm:text-xs mt-1 font-black leading-none">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-28 md:pb-8">
                {children}
            </main>
        </div>
    );
}
