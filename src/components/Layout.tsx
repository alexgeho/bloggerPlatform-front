import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from "antd";

export function Layout() {
  return (
    <AntLayout style={{ minHeight: "100vh", width: "100vw" }}>
      <Header />
      <AntLayout style={{ flex: 1 }}>
        <Sidebar />
        <AntLayout.Content style={{ padding: 24, overflow: "auto" }}>
          <Outlet />
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  );
}
