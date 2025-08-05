import "./App.css";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import EmailConfirmed from "./pages/EmailConfirmed";
import {Layout} from "./components/Layout.tsx";

function App() {

    return (
        <div className="app">

            <Routes>

                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Layout />} />
                <Route path="/email-confirmed" element={<EmailConfirmed />} />
            </Routes>
        </div>
    );
}

export default App;
