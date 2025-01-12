"use client";
import logo from "@/../public/images/logo/logo.svg";
import logoLight from "@/../public/images/logo/logo-light.svg";
import { Menu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Account from "@/components/Header/Account";
import {useTheme} from "next-themes";

const menuData = [
	{ title: "Home", path: "/" },
	{ title: "Features", path: "/#features" },
	{ title: "Pricing", path: "/#pricing" },
	{ title: "Contact", path: "/contact" }
];

const Header = () => {
	const [stickyMenu, setStickyMenu] = useState(false);
	const { data: session } = useSession();
	const pathUrl = usePathname();
	const { theme } = useTheme(); // Add this

	const handleStickyMenu = () => {
		if (window.scrollY > 0) {
			setStickyMenu(true);
		} else {
			setStickyMenu(false);
		}
	};

	const [navbarOpen, setNavbarOpen] = useState(false);
	const navbarToggleHandler = () => {
		setNavbarOpen(!navbarOpen);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleStickyMenu);
		return () => window.removeEventListener("scroll", handleStickyMenu);
	}, []);

	return (
		<header className={`fixed left-0 top-0 z-999 w-full transition-all duration-300 ease-in-out ${
			stickyMenu ? "bg-white dark:bg-gray-900 py-2 shadow-md xl:py-0" : "bg-white dark:bg-gray-900 py-2 shadow-md xl:py-0"
		}`}>
			<div className="relative mx-auto max-w-[1170px] items-center justify-between px-4 sm:px-8 xl:flex xl:px-0">
				<div className="flex w-full items-center justify-between xl:w-4/12">
					<Link href="/">
						<Image
							src={theme === 'dark' ? logoLight : logo}
							alt="SnapFood"
							className="w-full"
						/>
					</Link>

					<button
						onClick={navbarToggleHandler}
						aria-label='button for menu toggle'
						className='block xl:hidden'
					>
							<span className='relative block h-5.5 w-5.5 cursor-pointer'>
								<span className='du-block absolute right-0 h-full w-full'>
									<span
										className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "!w-full delay-300"
										}`}
									></span>
									<span
										className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "delay-400 !w-full"
										}`}
									></span>
									<span
										className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "!w-full delay-500"
										}`}
									></span>
								</span>
								<span className='du-block absolute right-0 h-full w-full rotate-45'>
									<span
										className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "!h-0 delay-[0]"
										}`}
									></span>
									<span
										className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "dealy-200 !h-0"
										}`}
									></span>
								</span>
							</span>
					</button>
				</div>

				<div
					className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-8/12 ${
						navbarOpen && "!visible relative mt-2 !h-auto max-h-[300px] overflow-y-auto rounded-md bg-white dark:bg-gray-900 p-4 sm:p-7.5 shadow-lg"
					}`}>
					<nav>
						<ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-2.5">
							{/*@ts-ignore*/}
							{menuData.map((item: Menu, key) => (
								<li key={key} className={`nav__menu ${stickyMenu ? "xl:py-4" : "xl:py-4"}`}>
									<Link
										// @ts-ignore
										href={item.path}
										className={`flex rounded-full px-[14px] py-[3px] font-medium ${
											stickyMenu ? "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
										}`}
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="mt-7 flex flex-wrap items-center lg:mt-0">
						<ThemeSwitcher/>

						{session?.user ? (
							<Account navbarOpen={navbarOpen}/>
						) : (
							<>
								<Link
									href="/auth/login"
									className={`px-5 py-2 font-medium ${
										stickyMenu ? "text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300" : "text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
									}`}
								>
									Sign In
								</Link>
								<Link
									href="/auth/signup"
									className="rounded-full bg-[#4F46E5] px-5 py-2 font-medium text-white hover:bg-[#4338CA]"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;