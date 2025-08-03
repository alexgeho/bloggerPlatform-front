// src/App.tsx
import "./App.css";

function App() {
    return (
        <div className="app">
            <header className="header">
                <h1>Blogger</h1>
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
                    <h2>Latest Posts</h2>
                    <ul>
                        <li>Post #1</li>
                        <li>Post #2</li>
                        <li>Post #3</li>
                    </ul>
                </main>
            </div>
        </div>
    );
}

export default App;
