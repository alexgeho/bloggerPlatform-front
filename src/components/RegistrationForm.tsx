import { useState } from "react";

export function RegistrationForm() {
    // Состояния для полей формы
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // Обработчик отправки
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Отправляем данные на бэкенд
            const response
                = await fetch("http://localhost:5003/auth/registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login, email, password }),
            });

            if (response.ok) {
                setMessage("Регистрация успешна");
                setLogin("");
                setEmail("");
                setPassword("");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Ошибка при регистрации");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            setMessage("Сервер недоступен");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
            {message && <p>{message}</p>}
        </form>
    );
}
