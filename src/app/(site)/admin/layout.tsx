"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { getSidebarDataForType } from "@/utils/getSidebarDataForType"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  
  // Get sidebar data
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
    <main className="min-h-screen bg-gray-2 dark:bg-[#151F34]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-[999] h-screen w-[290px] overflow-y-auto bg-white duration-300 ease-in-out dark:bg-gray-dark ${
          openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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

      {/* Overlay */}
      <div
        onClick={() => setOpenSidebar(false)}
        className={`fixed inset-0 z-[99] h-screen w-full bg-dark/80 lg:hidden ${
          openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      ></div>

      {/* Main Content */}
      <section className="lg:ml-[290px]">
        <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <div className="p-0 pt-0 md:p-5">
          {children}
        </div>
      </section>
    </main>
  );
};

export default DashboardLayout;