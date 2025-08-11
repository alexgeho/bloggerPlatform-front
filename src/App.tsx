import "./App.css";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { Layout } from "./components/Layout";
import Home from "./components/Home";
import BlogPage from "./pages/BlogPage";
import PostPage from "./pages/PostPage";
import UsersPage from "./pages/UsersPage";
import CreateUserPage from "./pages/CreateUserPage";
import InfoPage from "./pages/InfoPage";

/**
 * Главный компонент приложения
 * Определяет маршрутизацию и структуру приложения
 */
function App() {
    return (
        <Routes>
            {/* Основной макет с хедером и сайдбаром */}
            <Route path="/" element={<Layout />}>
                {/* Главная страница - показывает все блоги */}
                <Route index element={<Home />} />
                
                {/* Страницы авторизации */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                
                {/* Страницы контента */}
                <Route path="blogs/:id" element={<BlogPage />} />
                <Route path="posts/:id" element={<PostPage />} />
                
                {/* Административные страницы (только для админа) */}
                <Route path="users" element={<UsersPage />} />
                <Route path="create-user" element={<CreateUserPage />} />
                
                {/* Информационная страница */}
                <Route path="info" element={<InfoPage />} />
                
                {/* Fallback - перенаправление на главную */}
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    );
}

export default App;
