import "./App.css";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import EmailConfirmed from "./pages/EmailConfirmed";
import { Layout } from "./components/Layout";
import Home from "./components/Home";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="email-confirmed" element={<EmailConfirmed />} />
            </Route>
        </Routes>
    );
}

export default App;
