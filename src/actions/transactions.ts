"use server";

import { getSession } from "@/actions/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const transactionSchema = z.object({
    type: z.enum(["DONATION", "EXPENSE"]),
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    amount: z.coerce.number().min(1, "المبلغ يجب أن يكون أكبر من 0"),
    paymentMethod: z.enum(["CASH", "BANK", "MOBILE"]).optional(),
    notes: z.string().optional(),
});

export async function addTransaction(prevState: any, formData: FormData) {
    const session = await getSession();

    if (!session.user || !session.user.isLoggedIn) {
        return { error: "غير مصرح لك بالقيام بهذه العملية" };
    }

    // Construct object responsibly to avoid 'delete' on rigid types
    const rawData: Record<string, any> = {
        type: formData.get("type"),
        name: formData.get("name"),
        amount: formData.get("amount"),
        notes: formData.get("notes")
    };

    const paymentMethod = formData.get("paymentMethod");
    // Only add paymentMethod if it exists and is not empty string (HTML select might send empty string if placeholder)
    if (paymentMethod && typeof paymentMethod === 'string' && paymentMethod.trim() !== '') {
        rawData.paymentMethod = paymentMethod;
    }

    const result = transactionSchema.safeParse(rawData);

    if (!result.success) {
        // Format Zod errors
        const errors = result.error.flatten().fieldErrors;
        // Return the first error found for simplicity or a general error
        const firstError = Object.values(errors)[0]?.[0] || "بيانات غير صالحة";
        return { error: firstError };
    }

    const data = result.data;

    try {
        await prisma.transaction.create({
            data: {
                type: data.type,
                name: data.name,
                amount: data.amount,
                paymentMethod: data.type === 'DONATION' ? (data.paymentMethod || 'CASH') : null,
                notes: data.notes || "",
                enteredBy: session.user.email,
                isActive: true
            }
        });
    } catch (e) {
        console.error("Transaction Create Error:", e);
        return { error: "حدث خطأ أثناء حفظ البيانات" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reports");

    // Return success to reset form
    return { success: true, message: "تمت إضافة العملية بنجاح" };
}
