import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider>
      <AntdApp>
        <AuthProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);
