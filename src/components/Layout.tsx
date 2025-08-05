import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div className="app">
            <Header />
            <div className="main-layout">
                <Sidebar />
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
