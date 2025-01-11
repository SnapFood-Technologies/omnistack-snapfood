"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react"; // Import Lucide icons

export default function Sidebar({
  sidebarOthersData,
  sidebarData,
  sidebarRef,
}: any) {
  const pathname = usePathname();

  // Check current pathname for open menu.
  const currentOpenMenu = sidebarData.find(
    (i: any) => pathname.includes(i.path) || 0
  );
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({
    [currentOpenMenu?.id ?? 0]: true,
  });

  const toggleMenu = (id: number) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className="h-full border-r border-stroke px-6 py-8 dark:border-stroke-dark"
      >
        <Link href="/" className="inline-block">
          <Image
            src={"/images/logo/logo.svg"}
            alt="logo"
            className="block dark:hidden"
            width={200}
            height={30} // Slightly larger logo
          />
          <Image
            src={"/images/logo/logo-light.svg"}
            alt="logo"
            className="hidden dark:block"
            width={300}
            height={60} // Slightly larger logo
          />
        </Link>
        <div className="mb-6">
          <hr className="my-6 border-t border-gray-300 dark:border-white-900" />
          <ul className="space-y-2">
            {sidebarData &&
              sidebarData.map((item: any, key: number) => (
                <li key={key}>
                  <div>
                    <Link
                      href={item.children ? "#" : item.path}
                      className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 font-satoshi font-medium duration-300 ${
                        pathname === item.path
                          ? "bg-primary bg-opacity-10 text-primary dark:bg-white dark:bg-opacity-10 dark:text-white"
                          : "text-dark hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
                      }`}
                      onClick={
                        item.children
                          ? (e) => {
                              e.preventDefault();
                              toggleMenu(item.id);
                            }
                          : undefined
                      }
                    >
                      <span className="h-[24px] w-[24px]">{item.icon}</span>
                      {item.title}
                      {item.children && (
                        <span className="ml-auto">
                          {openMenus[item.id] ? (
                            <ChevronDown />
                          ) : (
                            <ChevronRight />
                          )}
                        </span>
                      )}
                    </Link>
                    {item.children && openMenus[item.id] && (
                      <ul className="ml-6 mt-2 space-y-2">
                        {item.children.map((child: any) => (
                          <li key={child.id}>
                            <Link
                              href={child.path}
                              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2 font-satoshi text-base font-medium duration-300 ${
                                pathname === child.path
                                  ? "bg-primary bg-opacity-10 text-primary dark:bg-white dark:bg-opacity-10 dark:text-white"
                                  : "text-dark hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
                              }`}
                            >
                              <span className="h-[22px] w-[22px]">
                                {child.icon}
                              </span>
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
        {sidebarOthersData && (
          <div>
            <p className="mb-4 font-satoshi text-sm font-medium uppercase text-body dark:text-gray-6">
              Others
            </p>
            <ul className="space-y-2">
              {sidebarOthersData.map((item: any) => (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 font-satoshi font-medium duration-300 ${
                      pathname === item.path
                        ? "bg-primary bg-opacity-10 text-primary dark:bg-white dark:bg-opacity-10 dark:text-white"
                        : "text-dark hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
