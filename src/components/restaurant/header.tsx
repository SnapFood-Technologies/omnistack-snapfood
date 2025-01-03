import { UserButton } from "@/components/restaurant/user-button"
// import { ThemeToggle } from "@/components/theme-toggle"
import { Search } from "lucide-react"

export default function Header() {
    return (
        <div className="fixed w-full z-50 flex items-center justify-between h-16 px-4 border-b bg-white">
            <div className="flex items-center">
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="h-10 block w-full rounded-md border border-gray-200 pl-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Search..."
                    />
                </div>
            </div>
            <div className="flex items-center gap-x-4">
                {/*<ThemeToggle />*/}
                <UserButton />
            </div>
        </div>
    )
}