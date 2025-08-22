import React, { ReactNode } from "react";

function CourseLayout({children}: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      {/* Sidebar 30% */}
      <div className="w-80 border-r border-border shrink-0">
        <h1>Sidebar</h1>
      </div>
      {/* Main content */}
      <div className=" flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default CourseLayout;
