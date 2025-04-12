// app/admin/customers/page.tsx
import { CustomersContent } from "@/components/admin/customers/customers-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Customers - SnapFood Admin",
    description: "View and manage your customer base",
};

export default function CustomersPage() {
    return (
        <div className="px-3">
            <CustomersContent />
        </div>
    )
}