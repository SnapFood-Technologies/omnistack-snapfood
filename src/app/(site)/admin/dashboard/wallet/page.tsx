// app/admin/dashboard/wallet/page.tsx
import { WalletContent } from "@/components/admin/dashboard/wallet-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wallet Dashboard & Stats - SnapFood Admin",
    description: "",
};

export default function WalletPage() {
    return (
        <div className="px-3">
            <WalletContent />
        </div>
    )
}