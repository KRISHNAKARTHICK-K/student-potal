import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#eef1f5]">
      <Sidebar />

      <div className="flex flex-1 flex-col lg:ml-[260px]">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
