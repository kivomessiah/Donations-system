"use client";

import { useState } from "react";
import { createUser, changePassword, updateUser, approveUser, rejectUser, deleteUser, verifyUsersAccess } from "@/actions/users";
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
    EyeOff,
    Pencil,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
    email: string;
    name: string;
    role: string;
    status: string;
}

export default function UserManagementClient({
    activeUsers,
    pendingUsers,
    currentUser
}: {
    activeUsers: User[],
    pendingUsers: User[],
    currentUser: { email: string, role: string, isUsersAuthorized: boolean }
}) {
    const [isAuthorized, setIsAuthorized] = useState(currentUser.isUsersAuthorized);
    const [authPass, setAuthPass] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPass, setShowPass] = useState(false);

    const handleAction = async (action: Function, ...args: any[]) => {
        setPending(true);
        setError("");
        const res = await action(...args);
        setPending(false);
        if (res.error) setError(res.error);
        else {
            if (res.success) setMessage(res.message || "تمت العملية بنجاح");

            // Specialized logic for verification
            if (action === verifyUsersAccess && res.success) {
                setIsAuthorized(true);
            }

            setTimeout(() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setIsPasswordModalOpen(false);
                setMessage("");
                setTargetUser(null);
            }, 1000);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-50/80 backdrop-blur-xl">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-2 border-gray-100 w-full max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                        <Lock size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-black mb-2">منطقة محمية</h2>
                    <p className="text-black font-bold text-lg mb-8 opacity-80">يرجى إدخال كلمة المرور الخاصة بك للوصول لإدارة المستخدمين</p>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleAction(verifyUsersAccess, authPass);
                    }} className="space-y-6">
                        <input
                            type="password"
                            required
                            value={authPass}
                            onChange={(e) => setAuthPass(e.target.value)}
                            placeholder="كلمة مرور المسؤول"
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none font-black text-black text-xl text-center"
                        />
                        {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-black border border-red-100 flex items-center justify-center gap-2">
                            <AlertCircle size={20} /> {error}
                        </div>}
                        <button
                            disabled={pending}
                            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {pending ? <Loader2 className="animate-spin" /> : "تأكيد الدخول"}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Active Users Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-black">إدارة المستخدمين</h1>
                        <p className="text-black mt-2 font-bold text-lg">قائمة بجميع المسؤولين النشطين في النظام</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95"
                    >
                        <Plus size={22} />
                        إضافة مستخدم
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-900 text-white font-black">
                                <tr>
                                    <th className="p-5">الاسم</th>
                                    <th className="p-5">البريد الإلكتروني</th>
                                    <th className="p-5">الصلاحية</th>
                                    <th className="p-5 text-center">تعديل</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activeUsers.map((user) => (
                                    <tr key={user.email} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="p-5 font-black text-black text-lg">{user.name}</td>
                                        <td className="p-5 text-black font-bold">{user.email}</td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                                user.role === 'VIEWER' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                                    'bg-blue-100 text-blue-800 border border-blue-200'
                                                }`}>
                                                {user.role === 'ADMIN' && <Shield size={16} />}
                                                {user.role === 'VIEWER' && <Eye size={16} />}
                                                {user.role === 'FINANCE' && <Wallet size={16} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => { setTargetUser(user); setIsEditModalOpen(true); }}
                                                    className="p-2.5 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-all"
                                                    title="تعديل البيانات"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => { setTargetUser(user); setIsPasswordModalOpen(true); }}
                                                    className="p-2.5 text-black hover:bg-gray-100 rounded-xl transition-all"
                                                    title="تغيير كلمة المرور"
                                                >
                                                    <Key size={20} />
                                                </button>
                                                {user.email !== currentUser.email && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`هل أنت متأكد من حذف حساب ${user.name}؟`)) {
                                                                handleAction(() => deleteUser(user.email));
                                                            }
                                                        }}
                                                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="حذف المستخدم"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pending Requests Section */}
            {pendingUsers.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-black">طلبات الانضمام (قيد الانتظار)</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden">
                        <table className="w-full text-right">
                            <thead className="bg-amber-50 text-amber-900 font-black border-b border-amber-100">
                                <tr>
                                    <th className="p-5">الاسم</th>
                                    <th className="p-5">البريد الإلكتروني</th>
                                    <th className="p-5">الصلاحية المطلوبة</th>
                                    <th className="p-5 text-center">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-50">
                                {pendingUsers.map((user) => (
                                    <tr key={user.email} className="bg-amber-50/20">
                                        <td className="p-5 font-black text-black">{user.name}</td>
                                        <td className="p-5 text-black font-bold">{user.email}</td>
                                        <td className="p-5 font-black text-indigo-800">{user.role}</td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    onClick={() => handleAction(() => approveUser(user.email))}
                                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-black shadow-md transition-all active:scale-95"
                                                >
                                                    <CheckCircle size={18} /> موافقة
                                                </button>
                                                <button
                                                    onClick={() => handleAction(() => rejectUser(user.email))}
                                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-black shadow-md transition-all active:scale-95"
                                                >
                                                    <XCircle size={18} /> رفض
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals (Generic Container) */}
            <AnimatePresence>
                {(isAddModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                                <h3 className="text-2xl font-black text-black">
                                    {isAddModalOpen ? "إضافة مستخدم جديد" : "تعديل بيانات المستخدم"}
                                </h3>
                                <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-gray-400 hover:text-black transition-colors"><X size={28} /></button>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleAction(isAddModalOpen ? createUser : updateUser, new FormData(e.currentTarget));
                            }} className="p-8 space-y-6">
                                {isEditModalOpen && <input type="hidden" name="email" value={targetUser?.email} />}

                                <div>
                                    <label className="block text-sm font-black text-black mb-2 mr-1">الاسم</label>
                                    <input name="name" defaultValue={isEditModalOpen ? targetUser?.name : ""} required className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none font-black text-black text-lg transition-all" />
                                </div>

                                {!isEditModalOpen && (
                                    <div>
                                        <label className="block text-sm font-black text-black mb-2 mr-1">اسم المستخدم (الإيميل)</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                name="email"
                                                required
                                                className="flex-1 px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none font-black text-black text-lg"
                                                placeholder=""
                                            />
                                            <span className="font-black text-indigo-700 bg-indigo-50 px-3 py-3 rounded-xl border-2 border-indigo-100 text-sm">@admin.com</span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-black text-black mb-2 mr-1">الصلاحية</label>
                                    <select name="role" defaultValue={isEditModalOpen ? targetUser?.role : "VIEWER"} required className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none font-black text-black text-lg bg-white appearance-none transition-all">
                                        <option value="VIEWER">مشاهد (Viewer) - عرض فقط</option>
                                        <option value="ENTRY">مدخل بيانات (Entry)</option>
                                        <option value="FINANCE">ماليات (Finance)</option>
                                        <option value="ADMIN">مدير (Admin)</option>
                                    </select>
                                </div>

                                {isAddModalOpen && (
                                    <div>
                                        <label className="block text-sm font-black text-black mb-2 mr-1">كلمة المرور</label>
                                        <div className="relative">
                                            <input type={showPass ? "text" : "password"} name="password" required className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none font-black text-black text-lg transition-all" />
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">{showPass ? <EyeOff size={22} /> : <Eye size={22} />}</button>
                                        </div>
                                    </div>
                                )}

                                {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-black flex items-center gap-3 border border-red-100"><AlertCircle size={20} /> {error}</div>}
                                {message && <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-black border border-green-100">{message}</div>}

                                <button disabled={pending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                                    {pending ? <Loader2 className="animate-spin" /> : (isAddModalOpen ? "حفظ المستخدم" : "تحديث البيانات")}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Password Modal (Reuse logic but with specialized fields) */}
            <AnimatePresence>
                {isPasswordModalOpen && targetUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsPasswordModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10">
                            <div className="p-8 border-b border-gray-100 text-center">
                                <h3 className="text-2xl font-black text-black">تغيير كلمة المرور</h3>
                                <p className="text-indigo-700 font-black mt-2">{targetUser.name}</p>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleAction(changePassword, new FormData(e.currentTarget));
                            }} className="p-8 space-y-6">
                                <input type="hidden" name="targetEmail" value={targetUser.email} />
                                <div>
                                    <label className="block text-sm font-black text-black mb-2 mr-1">
                                        {currentUser.email === targetUser.email ? "كلمة المرور الحالية" : "كلمة مرورك أنت (كمسؤول)"}
                                    </label>
                                    <input type="password" name="verificationPassword" required className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none font-black text-black text-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-black mb-2 mr-1">كلمة المرور الجديدة</label>
                                    <input type="password" name="newPassword" required className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none font-black text-black text-lg" />
                                </div>

                                {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-black border border-red-100">{error}</div>}
                                {message && <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-black border border-green-100">{message}</div>}

                                <button disabled={pending} className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95">
                                    {pending ? <Loader2 className="animate-spin mx-auto" /> : "تأكيد التغيير"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
