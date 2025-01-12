"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import logo from "@/../public/images/logo/logo.svg"
import logoLight from "@/../public/images/logo/logo-light.svg"

const Header = () => {
  const { theme } = useTheme()

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="relative mx-auto max-w-[1170px] px-4 sm:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center">
            <Image
              src={theme === 'dark' ? logoLight : logo}
              alt="SnapFood Admin"
              className="w-[60%] h-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              Admin Hub
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header