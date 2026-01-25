import prisma from "@/lib/prisma";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import UserManagementClient from "@/components/UserManagementClient";

export default async function UsersPage() {
    const session = await getSession();

    // Strict RBAC Check
    if (session.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const activeUsers = await prisma.user.findMany({
        where: { status: "ACTIVE" },
        select: {
            email: true,
            name: true,
            role: true,
            status: true,
        },
        orderBy: { name: 'asc' }
    });

    const pendingUsers = await prisma.user.findMany({
        where: { status: "PENDING" },
        select: {
            email: true,
            name: true,
            role: true,
            status: true,
        },
        orderBy: { name: 'asc' }
    });

    return (
        <UserManagementClient
            activeUsers={activeUsers}
            pendingUsers={pendingUsers}
            currentUser={{
                email: session.user.email,
                role: session.user.role,
                isUsersAuthorized: !!session.user.isUsersAuthorized
            }}
        />
    );
}
