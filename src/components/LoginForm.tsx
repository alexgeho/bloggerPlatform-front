import { useState } from "react";
import { Form, Input, Button, Card, Typography, Space, message } from "antd";
import { API } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  // Состояние загрузки при входе
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Обработчик отправки формы входа
  const onFinish = async (values: { loginOrEmail: string; password: string }) => {
    setLoading(true);
    try {
      const res = await API.auth.login(values);
      const token = (res as { accessToken?: string })?.accessToken;
      if (token) {
        login(token);
        message.success("Вход выполнен успешно");
        navigate("/");
      } else {
        message.error("Токен не получен");
      }
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 420 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Вход</Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="loginOrEmail" label="Логин или Email" rules={[{ required: true }] }>
            <Input placeholder="Введите логин или email" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Войти</Button>
        </Form>
      </Space>
    </Card>
  );
}


