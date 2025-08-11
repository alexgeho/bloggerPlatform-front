import { useState } from "react";
import { API } from "../api";
import { Form, Input, Button, Typography, Card, Space, message as antdMessage } from "antd";

export function RegistrationForm() {
    // Состояния для полей формы
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // Обработчик отправки формы регистрации
    const handleSubmit = async () => {
        try {
            await API.auth.register({ login, email, password });
            setMessage("Регистрация прошла успешно");
            setLogin("");
            setEmail("");
            setPassword("");
            antdMessage.success("Регистрация прошла успешно");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Ошибка регистрации";
            setMessage(msg);
            antdMessage.error(msg);
        }
    };

    return (
        <Card style={{ maxWidth: 420 }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Typography.Title level={3} style={{ margin: 0 }}>Регистрация</Typography.Title>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Логин" required>
                        <Input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин" />
                    </Form.Item>
                    <Form.Item label="Email" required rules={[{ type: "email" }] }>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </Form.Item>
                    <Form.Item label="Пароль" required>
                        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Зарегистрироваться</Button>
                    </Form.Item>
                    {message && <Typography.Text type="secondary">{message}</Typography.Text>}
                </Form>
            </Space>
        </Card>
    );
}
