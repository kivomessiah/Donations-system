"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/actions/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
    const session = await getSession();
    if (session.user?.role !== "ADMIN") {
        return { error: "غير مصرح لك بإضافة مستخدمين" };
    }

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    if (!email || !name || !role || !password) {
        return { error: "جميع الحقول مطلوبة" };
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: "هذا البريد المستخدم مسبقاً" };

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                name,
                role,
                password: hashedPassword,
                status: "ACTIVE"
            },
        });

        revalidatePath("/dashboard/users");
        return { success: true, message: "تم إضافة المستخدم بنجاح" };
    } catch (error) {
        console.error("Create User Error:", error);
        return { error: "حدث خطأ غير متوقع" };
    }
}

export async function registerUser(state: any, formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    if (!email || !name || !role || !password) {
        return { error: "جميع الحقول مطلوبة" };
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { error: "هذا البريد المستخدم مسبقاً" };

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                name,
                role,
                password: hashedPassword,
                status: "PENDING"
            },
        });

        return { success: true, message: "تم تقديم طلبك بنجاح، بانتظار موافقة المسؤول" };
    } catch (error) {
        console.error("Register User Error:", error);
        return { error: "حدث خطأ غير متوقع" };
    }
}

export async function updateUser(formData: FormData) {
    const session = await getSession();
    if (session.user?.role !== "ADMIN") return { error: "غير مصرح لك" };

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    try {
        await prisma.user.update({
            where: { email },
            data: { name, role }
        });
        revalidatePath("/dashboard/users");
        return { success: true, message: "تم تحديث البيانات بنجاح" };
    } catch (error) {
        console.error("Update User Error:", error);
        return { error: "خطأ في التحديث" };
    }
}

export async function approveUser(email: string) {
    const session = await getSession();
    if (session.user?.role !== "ADMIN") return { error: "غير مصرح لك" };

    try {
        await prisma.user.update({
            where: { email },
            data: { status: "ACTIVE" }
        });
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        return { error: "حدث خطأ أثناء التفعيل" };
    }
}

export async function rejectUser(email: string) {
    const session = await getSession();
    if (session.user?.role !== "ADMIN") return { error: "غير مصرح لك" };

    try {
        await prisma.user.update({
            where: { email },
            data: { status: "REJECTED" }
        });
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        return { error: "حدث خطأ أثناء الرفض" };
    }
}

export async function changePassword(formData: FormData) {
    const session = await getSession();
    if (!session.user?.isLoggedIn) return { error: "يجب تسجيل الدخول أولاً" };

    const targetEmail = formData.get("targetEmail") as string;
    const verificationPassword = formData.get("verificationPassword") as string; // Current user's password
    const newPassword = formData.get("newPassword") as string;

    if (!targetEmail || !verificationPassword || !newPassword) {
        return { error: "جميع الحقول مطلوبة" };
    }

    try {
        // 1. Verify credentials of the requester
        const requester = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!requester) return { error: "تعذر التحقق من هويتك" };

        const isMatch = await bcrypt.compare(verificationPassword, requester.password);
        if (!isMatch) {
            return { error: session.user.email === targetEmail ? "كلمة المرور القديمة غير صحيحة" : "كلمة مرور المدير غير صحيحة" };
        }

        // 2. Authorization check
        const isSelf = session.user.email === targetEmail;
        const isAdmin = session.user.role === "ADMIN";

        if (!isSelf && !isAdmin) {
            return { error: "غير مصرح لك بتغيير كلمة مرور مستخدم آخر" };
        }

        // 3. Update target user
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email: targetEmail },
            data: { password: hashedNewPassword },
        });

        return { success: true, message: "تم تغيير كلمة المرور بنجاح" };
    } catch (error) {
        console.error("Change Password Error:", error);
        return { error: "حدث خطأ غير متوقع" };
    }
}
