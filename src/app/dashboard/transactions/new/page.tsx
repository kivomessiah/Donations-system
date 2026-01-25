import TransactionForm from "@/components/TransactionForm";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function NewTransactionPage() {
    const session = await getSession();
    if (session.user?.role === "VIEWER") {
        redirect("/dashboard");
    }

    return (
        <div className="py-8">
            <TransactionForm />
        </div>
    );
}
