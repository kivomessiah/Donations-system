"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { defaultSession, sessionOptions, SessionData } from "@/lib/session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.user) {
        session.user = defaultSession.user;
    }

    return session;
}

export async function login(prevState: any, formData: FormData) {
    const session = await getSession();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
        }

        session.user = {
            email: user.email,
            name: user.name,
            role: user.role,
            isLoggedIn: true,
        };

        await session.save();
    } catch (error) {
        console.error("Login Error:", error);
        return { error: "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا" };
    }

    redirect("/dashboard");
}

export async function logout() {
    const session = await getSession();
    session.destroy();
    redirect("/login");
}
