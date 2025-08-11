import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import { useNavigate } from "react-router-dom";
import { API } from "../api";
import { Card, Typography, Form, Input, Button, Space, message } from "antd";

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Проверяем, является ли текущий пользователь админом
  const { isAdmin } = useAuth();

  // Если не админ, перенаправляем
  if (!isAdmin()) {
    navigate("/");
    return null;
  }

  // Обработчик создания пользователя
  const handleCreateUser = async (values: { login: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await API.user.createUser(values);
      message.success("Пользователь создан");
      navigate("/users");
    } catch {
      message.error("Не удалось создать пользователя");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Создать пользователя">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Paragraph>
          Создайте нового пользователя на платформе.
        </Typography.Paragraph>
        
        <Form layout="vertical" onFinish={handleCreateUser}>
          <Form.Item 
            name="login" 
            label="Логин" 
            rules={[
              { required: true, message: 'Введите логин' },
              { min: 3, max: 10, message: 'Логин должен быть от 3 до 10 символов' }
            ]}
          >
            <Input placeholder="Введите логин" />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input placeholder="Введите email" />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            label="Пароль" 
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, max: 20, message: 'Пароль должен быть от 6 до 20 символов' }
            ]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          
          <Space>
            <Button onClick={() => navigate("/users")}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Создать пользователя
            </Button>
          </Space>
        </Form>
      </Space>
    </Card>
  );
}
