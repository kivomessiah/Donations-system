"use client";

import { useState } from "react";
import { createUser, changePassword } from "@/actions/users";
import {
    Shield,
    User as UserIcon,
    Wallet,
    Plus,
    Key,
    X,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
    email: string;
    name: string;
    role: string;
}

export default function UserManagementClient({
    users,
    currentUser
}: {
    users: User[],
    currentUser: { email: string, role: string }
}) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPass, setShowPass] = useState(false);

    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setError("");
        const formData = new FormData(e.currentTarget);
        const res = await createUser(formData);
        setPending(false);
        if (res.error) setError(res.error);
        else {
            setMessage(res.message || "");
            setTimeout(() => {
                setIsAddModalOpen(false);
                setMessage("");
            }, 2000);
        }
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setError("");
        const formData = new FormData(e.currentTarget);
        const res = await changePassword(formData);
        setPending(false);
        if (res.error) setError(res.error);
        else {
            setMessage(res.message || "");
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setMessage("");
                setTargetUser(null);
            }, 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
                    <p className="text-gray-600 mt-2 font-medium">قائمة بجميع المسؤولين وصلاحياتهم</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    إضافة مستخدم
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-gray-900 font-bold border-b border-gray-100">
                            <tr>
                                <th className="p-4">الاسم</th>
                                <th className="p-4">البريد الإلكتروني</th>
                                <th className="p-4">الصلاحية</th>
                                <th className="p-4 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{user.name}</td>
                                    <td className="p-4 text-gray-700 font-medium">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'VIEWER' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role === 'ADMIN' && <Shield size={14} />}
                                            {user.role === 'VIEWER' && <Eye size={14} />}
                                            {user.role === 'FINANCE' && <Wallet size={14} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                setTargetUser(user);
                                                setIsPasswordModalOpen(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            title="تغيير كلمة المرور"
                                        >
                                            <Key size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-900">إضافة مستخدم جديد</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddUser} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">الاسم</label>
                                    <input name="name" required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">البريد الإلكتروني</label>
                                    <input type="email" name="email" required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">الصلاحية</label>
                                    <select name="role" required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold">
                                        <option value="VIEWER">مشاهد (Viewer) - عرض فقط</option>
                                        <option value="ENTRY">مدخل بيانات (Entry)</option>
                                        <option value="ADMIN">مدير (Admin)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">كلمة المرور</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            name="password"
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
                                {message && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-bold">{message}</div>}

                                <button disabled={pending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                                    {pending ? <Loader2 className="animate-spin" /> : "حفظ المستخدم"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Change Password Modal */}
            <AnimatePresence>
                {isPasswordModalOpen && targetUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-900 text-center">تغيير كلمة المرور</h3>
                                <p className="text-gray-500 text-sm text-center font-medium mt-1">للمستخدم: {targetUser.name}</p>
                            </div>
                            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                                <input type="hidden" name="targetEmail" value={targetUser.email} />

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">
                                        {currentUser.email === targetUser.email ? "كلمة المرور الحالية" : "كلمة مرور المدير (لتأكيد هويتك)"}
                                    </label>
                                    <input type="password" name="verificationPassword" required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">كلمة المرور الجديدة</label>
                                    <input type="password" name="newPassword" required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-bold" />
                                </div>

                                {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
                                {message && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-bold">{message}</div>}

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">إلغاء</button>
                                    <button disabled={pending} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                        {pending ? <Loader2 className="animate-spin" /> : "تأكيد التغيير"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
