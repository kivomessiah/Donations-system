"use server";

import { getSession } from "@/actions/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTransactionStatus(id: string) {
    const session = await getSession();

    // Only Admin or Finance can delete/toggle usually, or maybe Entry who made it?
    // User rules: "لا يمكن حذفه نهائيًا" -> IsActive = false
    // All roles check: user must be logged in. 
    if (!session.user?.isLoggedIn) {
        return { error: "غير مصرح" };
    }

    try {
        // Toggle logic or just Deactivate?
        // Requirement: "تغيير IsActive = FALSE لإلغاء السجل"

        const transaction = await prisma.transaction.findUnique({ where: { id } });
        if (!transaction) return { error: "غير موجود" };

        await prisma.transaction.update({
            where: { id },
            data: {
                isActive: !transaction.isActive // Toggle allows undoing the delete if needed, or strictly false if we want "Delete" behavior
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/reports");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "فشل التعديل" };
    }
}
