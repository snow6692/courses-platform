import Navbar from "@/components/shared/Navbar";
import React, { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
