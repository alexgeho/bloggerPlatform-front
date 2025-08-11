import { useState } from "react";
import { API } from "../api";
import { Layout, Typography, Button, Modal, Form, Input, Space, message, Avatar, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { UserOutlined, LogoutOutlined, BookOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

export default function Sidebar() {
  // Состояние для модального окна создания блога
  const [open, setOpen] = useState(false);
  // Состояние загрузки при создании блога
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Проверяем права доступа пользователя
  const { isAdmin } = useAuth();
  const canManageBlogs = isAdmin();



  // Обработчик создания нового блога
  const handleCreate = async (values: { name: string; description: string; websiteUrl: string }) => {
    setCreating(true);
    try {
              const created = await API.blog.createBlog(values);
      message.success("Блог создан");
      setOpen(false);
      if (created?.id) navigate(`/blogs/${created.id}`);
    } catch {
      message.error("Не удалось создать блог");
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

    return (
    <Layout.Sider width={280} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
      <div style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {isAuthenticated ? (
          // Панель для авторизованного пользователя
          <>
            {/* Профиль пользователя */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ marginBottom: 16, backgroundColor: '#1890ff' }}
              />
              <Typography.Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                {user?.login}
              </Typography.Title>
              <Typography.Text type="secondary">
                {user?.email}
              </Typography.Text>
            </div>

            <Divider />

            {/* Навигация */}
            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
              <Button 
                type="text" 
                icon={<BookOutlined />}
                size="large"
                style={{ width: '100%', textAlign: 'left', height: 45, fontSize: 16 }}
                onClick={() => navigate("/")}
              >
                Все блоги
              </Button>
              


                            <Button 
                type="text" 
                icon={<InfoCircleOutlined />}
                size="large"
                style={{ width: '100%', textAlign: 'left', height: 45, fontSize: 16 }}
                onClick={() => navigate("/info")}
              >
                О платформе
              </Button>
            </Space>

            {/* Администрирование для админа */}
            {canManageBlogs && (
              <>
                <Divider />
                <div style={{ marginBottom: 16 }}>
                  <Typography.Title level={5} style={{ margin: 0, marginBottom: 12 }}>
                    Администрирование
                  </Typography.Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      size="large"
                      style={{ width: '100%', height: 45, fontSize: 15 }}
                      onClick={() => setOpen(true)}
                    >
                      Создать блог
                    </Button>
                    
                    <Button 
                      type="default" 
                      icon={<UserOutlined />}
                      size="large"
                      style={{ width: '100%', height: 45, fontSize: 15 }}
                      onClick={() => navigate("/users")}
                    >
                      Управление пользователями
                    </Button>
                  </Space>
                </div>
              </>
            )}





            <div style={{ flex: 1 }} />

            {/* Кнопка выхода */}
            <Divider />
            <Button 
              type="text" 
              danger
              icon={<LogoutOutlined />}
              size="large"
              style={{ width: '100%', textAlign: 'left', height: 45, fontSize: 16 }}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </>
        ) : (
          // Панель для неавторизованного пользователя
          <>
            {/* Приветствие */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ marginBottom: 16, backgroundColor: '#d9d9d9' }}
              />
              <Typography.Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                Гость
              </Typography.Title>
              <Typography.Text type="secondary">
                Войдите в систему
              </Typography.Text>
            </div>

            <Divider />

            {/* Кнопки авторизации */}
            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
              <Button 
                type="primary" 
                size="large"
                style={{ width: '100%', height: 45, fontSize: 16 }}
                onClick={() => navigate("/login")}
              >
                Войти
              </Button>
              
              <Button 
                size="large"
                style={{ width: '100%', height: 45, fontSize: 16 }}
                onClick={() => navigate("/register")}
              >
                Регистрация
              </Button>
            </Space>

            <Divider />

            {/* Навигация для гостей */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button 
                type="text" 
                icon={<BookOutlined />}
                size="large"
                style={{ width: '100%', textAlign: 'left', height: 45, fontSize: 16 }}
                onClick={() => navigate("/")}
              >
                Все блоги
              </Button>
              
              <Button 
                type="text" 
                icon={<InfoCircleOutlined />}
                size="large"
                style={{ width: '100%', textAlign: 'left', height: 45, fontSize: 16 }}
                onClick={() => navigate("/info")}
              >
                О платформе
              </Button>
            </Space>
          </>
        )}
      </div>

      {/* Модальное окно создания блога - только для админа */}
      {canManageBlogs && (
        <Modal
          open={open}
          title="Создать блог"
          onCancel={() => setOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form layout="vertical" onFinish={handleCreate}>
            <Form.Item name="name" label="Название" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Описание">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="websiteUrl" label="URL сайта" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Space>
              <Button onClick={() => setOpen(false)}>Отмена</Button>
              <Button type="primary" htmlType="submit" loading={creating}>Создать</Button>
            </Space>
          </Form>
        </Modal>
      )}
    </Layout.Sider>
  );
}