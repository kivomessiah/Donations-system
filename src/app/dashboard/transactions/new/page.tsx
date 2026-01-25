import TransactionForm from "@/components/TransactionForm";

export default function NewTransactionPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إضافة عملية جديدة</h1>
                <p className="text-gray-500 mt-2">قم بإدخال بيانات التبرع أو المصروف بدقة</p>
            </div>

            <TransactionForm />
        </div>
    );
}
