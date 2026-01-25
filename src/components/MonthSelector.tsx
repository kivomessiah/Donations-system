"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";

export default function MonthSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentMonth = searchParams.get("month") || new Date().toISOString().slice(0, 7); // YYYY-MM

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("month", value);
        } else {
            params.delete("month");
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
            <Calendar size={18} className="text-gray-400" />
            <input
                type="month"
                value={currentMonth}
                onChange={handleChange}
                className="outline-none text-sm text-gray-700 bg-transparent"
                lang="ar"
            />
        </div>
    );
}
