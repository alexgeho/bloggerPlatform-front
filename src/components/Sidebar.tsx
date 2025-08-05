import { useEffect, useState } from "react";
import { blogsApi } from "../services/blogsApi";

export default function Sidebar() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        blogsApi.getBlogs().then(data => setBlogs(data.items));
    }, []);

    return (
        <aside className="sidebar">
            <h3>Blogs</h3>
            <ul>
                {blogs.map((b: any) => (
                    <li key={b.id}>{b.name}</li>
                ))}
            </ul>
        </aside>
    );
}
