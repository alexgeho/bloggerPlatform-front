import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5003", // твой бэкенд
    withCredentials: true,            // если используешь куки/авторизацию
});

export const blogsApi = {
    async getBlogs() {
        const res = await instance.get("/blogs");
        return res.data;
    },

    async getPostsByBlogId(blogId: string) {
        const res = await instance.get(`/blogs/${blogId}/posts`);
        return res.data;
    }
};
