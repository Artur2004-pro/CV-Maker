import React from "react";
import { Sidebar } from "../components/sidebar/Sidebar";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
};
