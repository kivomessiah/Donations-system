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

    const rawUsers = await prisma.user.findMany({
        select: {
            email: true,
            name: true,
            role: true,
        },
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <UserManagementClient
            users={rawUsers}
            currentUser={{
                email: session.user.email,
                role: session.user.role
            }}
        />
    );
}
