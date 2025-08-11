import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import { Card, Table, Button, Space, message, Popconfirm, Tag } from "antd";

import { PlusOutlined } from '@ant-design/icons';

import type { User } from '../types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Загружаем список пользователей
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await API.user.getUsers<User>();
      setUsers(data.items);
    } catch {
      message.error("Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
    }
  }, [isAdmin]);

  // Если не админ, перенаправляем
  if (!isAdmin()) {
    navigate("/");
    return null;
  }

  // Обработчик удаления пользователя
  const handleDeleteUser = async (userId: string) => {
    try {
      await API.user.deleteUser(userId);
      message.success("Пользователь удален");
      await loadUsers();
    } catch {
      message.error("Не удалось удалить пользователя");
    }
  };



  const columns = [
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (_: unknown, record: User) => (
        <Tag color={record.login === 'admin' ? 'red' : 'blue'}>
          {record.login === 'admin' ? 'Админ' : 'Пользователь'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Popconfirm
            title="Удалить этого пользователя?"
            onConfirm={() => handleDeleteUser(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small">Удалить</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Управление пользователями"
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate("/create-user")}
        >
          Создать пользователя
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </Card>
  );
}
