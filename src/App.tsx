import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import EmailConfirmed from "./pages/EmailConfirmed";

function App() {
    const navigate = useNavigate();

    return (
        <div className="app">
            <header className="header">
                <h1>Blogger Platform</h1>
                <button className="signin" onClick={() => navigate("/register")}>
                    Sign In
                </button>
            </header>

            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="main-layout">
                            <aside className="sidebar">
                                <h2>Blogs</h2>
                                <ul>
                                    <li>Frontend</li>
                                    <li>Backend</li>
                                    <li>AI</li>
                                </ul>
                            </aside>
                            <main className="content">
                                <h2>Top Posts</h2>
                                <div className="post-grid">
                                    <div className="post-card">Post #1</div>
                                    <div className="post-card">Post #2</div>
                                    <div className="post-card">Post #3</div>
                                    <div className="post-card">Post #4</div>
                                    <div className="post-card">Post #5</div>
                                </div>
                            </main>
                        </div>
                    }
                />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/email-confirmed" element={<EmailConfirmed />} />
            </Routes>
        </div>
    );
}

export default App;
