// src/App.tsx
import "./App.css";

function App() {
    return (
        <div className="app">
            <header className="header">
                <h1>Blogger Platform</h1>
                <button className="signin">Sign In</button>
            </header>
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
        </div>
    );
}

export default App;
