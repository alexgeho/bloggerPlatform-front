import { Card, Typography, Space, Divider, Tag } from "antd";
import { useAuth } from "../contexts/AuthContext";

export default function InfoPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Card title="О платформе">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Paragraph style={{ fontSize: 16 }}>
          Добро пожаловать на платформу для блогеров! Это централизованная система управления контентом.
        </Typography.Paragraph>

        <Divider />

        <div>
          <Typography.Title level={4}>Система прав доступа</Typography.Title>
          
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
              <Typography.Title level={5} style={{ color: '#52c41a' }}>
                👥 Неавторизованные пользователи
              </Typography.Title>
              <Typography.Paragraph style={{ margin: 0 }}>
                • Чтение блогов и постов
                • Просмотр комментариев
                • <Typography.Text type="secondary">Не могут добавлять комментарии</Typography.Text>
              </Typography.Paragraph>
            </Card>

            <Card size="small" style={{ backgroundColor: '#e6f7ff' }}>
              <Typography.Title level={5} style={{ color: '#1890ff' }}>
                👤 Авторизованные пользователи
              </Typography.Title>
              <Typography.Paragraph style={{ margin: 0 }}>
                • Чтение блогов и постов
                • Просмотр комментариев
                • Добавление комментариев к постам
                • <Typography.Text type="secondary">Не могут создавать блоги и посты</Typography.Text>
              </Typography.Paragraph>
            </Card>

            <Card size="small" style={{ backgroundColor: '#fff2e8' }}>
              <Typography.Title level={5} style={{ color: '#fa8c16' }}>
                🔧 Администратор
              </Typography.Title>
              <Typography.Paragraph style={{ margin: 0 }}>
                • Создание и управление блогами
                • Создание и редактирование постов
                • Удаление блогов и постов
                • Управление пользователями
                • Удаление комментариев
              </Typography.Paragraph>
            </Card>
          </Space>
        </div>

        <Divider />

        <div>
          <Typography.Title level={4}>Как это работает</Typography.Title>
          <Typography.Paragraph>
            Платформа работает по принципу централизованного управления контентом:
          </Typography.Paragraph>
          
          <Space direction="vertical" size="small">
            <Typography.Text>• <strong>Администратор</strong> создает блоги и посты</Typography.Text>
            <Typography.Text>• <strong>Пользователи</strong> читают контент и комментируют</Typography.Text>
            <Typography.Text>• <strong>Система</strong> обеспечивает качественный контент</Typography.Text>
          </Space>
        </div>

        <Divider />

        <div>
          <Typography.Title level={4}>Ваш статус</Typography.Title>
          <Space>
            <Typography.Text>Текущий статус: </Typography.Text>
            {!isAuthenticated ? (
              <Tag color="orange">Неавторизован</Tag>
            ) : isAdmin() ? (
              <Tag color="red">Администратор</Tag>
            ) : (
              <Tag color="blue">Авторизованный пользователь</Tag>
            )}
          </Space>
        </div>

        {!isAuthenticated && (
          <Card size="small" style={{ backgroundColor: '#fff7e6', borderColor: '#ffd591' }}>
            <Typography.Paragraph style={{ margin: 0, textAlign: 'center' }}>
              <Typography.Text type="secondary">
                Для получения доступа к комментариям необходимо авторизоваться
              </Typography.Text>
            </Typography.Paragraph>
          </Card>
        )}
      </Space>
    </Card>
  );
}
