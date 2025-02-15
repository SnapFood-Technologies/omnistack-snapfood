"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { getSidebarDataForType } from "@/utils/getSidebarDataForType"
import Footer from "@/components/Footer";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  
  const { 
    mainMenu, 
    sales, 
    crm, 
    marketing, 
    communication,
    finance,
    settings
  } = getSidebarDataForType('FOOD');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:static lg:translate-x-0 ${
          openSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar 
          mainMenu={mainMenu}
          sales={sales}
          crm={crm}
          marketing={marketing}
          communication={communication}
          finance={finance}
          settings={settings}
        />
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <div className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
          {children}
        </div>
		<Footer/>
      </main>

      {/* Overlay */}
      {openSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;