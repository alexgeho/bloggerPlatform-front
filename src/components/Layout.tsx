// import { Header } from "./Header.tsx";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/*<Header />*/}
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
