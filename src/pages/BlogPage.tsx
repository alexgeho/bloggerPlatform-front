import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api";
import { Card, Typography, Space, Button, Popconfirm, Form, Input, message, Modal, Row, Col, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from "../contexts/AuthContext";


import type { Blog, Post, BlogInput, ApiResponse } from '../types';

/**
 * Страница отдельного блога
 * Отображает информацию о блоге и список постов
 * Позволяет админу редактировать/удалять блог и создавать новые посты
 */
export default function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  
  // Состояние для пагинации постов
  const [postsPagination, setPostsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pagesCount: 1
  });

  // Проверяем права доступа пользователя
  const { isAdmin } = useAuth();
  const canManageBlog = isAdmin();

  /**
   * Загружает данные блога и его постов
   * Вызывается при изменении id блога
   */
  const load = useCallback(async (page: number = 1, pageSize: number = 10) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await API.blog.getBlog<Blog>(id);
      setBlog(data);
      const postsData: ApiResponse<Post> = await API.blog.getPostsByBlogId<Post>(id, page, pageSize);
      setPosts(postsData.items);
      setPostsPagination({
        current: postsData.page,
        pageSize: postsData.pageSize,
        total: postsData.totalCount,
        pagesCount: postsData.pagesCount
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Обработчик изменения страницы постов
   */
  const handlePostsPageChange = (page: number, pageSize: number) => {
    load(page, pageSize);
  };

  // Загружаем данные при изменении id
  useEffect(() => {
    load();
  }, [load]);

  /**
   * Обработчик удаления блога
   * Удаляет блог с сервера и перенаправляет на главную страницу
   */
  const handleDelete = async () => {
    if (!id) return;
          await API.blog.deleteBlog(id);
    message.success("Блог удален");
    navigate("/");
  };

  /**
   * Обработчик создания нового поста
   * Создает пост в текущем блоге и обновляет список постов
   */
  const handleCreatePost = async (values: { title: string; shortDescription: string; content: string }) => {
    if (!id) return;
            await API.post.createPost(id, {
      ...values,
      blogId: id
    });
    message.success("Пост создан");
    setOpenCreatePost(false);
    await load(postsPagination.current, postsPagination.pageSize);
  };

  // Обработчик обновления блога
  const handleUpdate = async (values: BlogInput) => {
    if (!id) return;
            await API.blog.updateBlog(id, values);
    message.success("Блог обновлен");
    setEditing(false);
    await load(postsPagination.current, postsPagination.pageSize);
  };

  if (!id) return null;

  return (
    <div style={{ padding: '24px' }}>
      {/* Информация о блоге */}
      <Card
        loading={loading}
        style={{ marginBottom: 24 }}
        extra={
          canManageBlog && (
            <Space>
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => setEditing(true)}
                style={{ color: '#1890ff' }}
              />
              <Popconfirm 
                title="Удалить этот блог?" 
                onConfirm={handleDelete} 
                okButtonProps={{ danger: true }}
              >
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  style={{ color: '#ff4d4f' }}
                />
              </Popconfirm>
            </Space>
          )
        }
      >
        {!editing ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Typography.Title level={2} style={{ margin: 0 }}>{blog?.name}</Typography.Title>
            {blog?.description && (
              <Typography.Paragraph style={{ fontSize: 16 }}>
                {blog.description}
              </Typography.Paragraph>
            )}
            <Space direction="vertical" size="small">
              <Typography.Text type="secondary">
                Создан: {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}
              </Typography.Text>
              {blog?.websiteUrl && (
                <Typography.Link 
                  href={blog.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  🌐 {blog.websiteUrl}
                </Typography.Link>
              )}
              {blog?.isMembership && (
                <Typography.Text type="success">Премиум блог</Typography.Text>
              )}
            </Space>
            {!canManageBlog && (
              <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                Для управления блогами обратитесь к администратору системы.
              </Typography.Text>
            )}
          </Space>
        ) : (
          <Form layout="vertical" initialValues={{ name: blog?.name, description: blog?.description, websiteUrl: blog?.websiteUrl }} onFinish={handleUpdate}>
            <Form.Item label="Название" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Описание" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="URL сайта" name="websiteUrl" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Space>
              <Button onClick={() => setEditing(false)}>Отмена</Button>
              <Button type="primary" htmlType="submit">Сохранить</Button>
            </Space>
          </Form>
        )}
      </Card>

      {/* Посты блога */}
      <Card 
        title={`Посты блога "${blog?.name}"`}
        extra={
          canManageBlog && (
            <Button type="primary" onClick={() => setOpenCreatePost(true)}>
              Добавить пост
            </Button>
          )
        }
      >
        {posts.length > 0 ? (
          <Row gutter={[16, 16]}>
            {posts.map((post) => (
              <Col xs={24} sm={12} md={8} lg={6} key={post.id}>
                <Card
                  hoverable
                  style={{ 
                    height: '100%',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  cover={
                    <div style={{ 
                      height: 120, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                      }} />
                      <Typography.Title 
                        level={2} 
                        style={{ 
                          color: 'white', 
                          margin: 0, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        {post.title.charAt(0).toUpperCase()}
                      </Typography.Title>
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <Typography.Title 
                        level={4} 
                        style={{ 
                          margin: 0, 
                          marginBottom: 8,
                          color: '#2c3e50',
                          fontWeight: 600
                        }}
                      >
                        {post.title}
                      </Typography.Title>
                    }
                    description={
                      <div>
                        <Typography.Paragraph 
                          ellipsis={{ rows: 3 }}
                          style={{ 
                            marginBottom: 12,
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: '#7f8c8d'
                          }}
                        >
                          {post.shortDescription || post.excerpt || post.content?.slice(0, 120) + "..."}
                        </Typography.Paragraph>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderTop: '1px solid #ecf0f1'
                        }}>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            📅 {new Date(post.createdAt).toLocaleDateString()}
                          </Typography.Text>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            📖 Читать
                          </Typography.Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Typography.Text type="secondary" style={{ fontSize: 16 }}>
              В этом блоге пока нет постов.
              {canManageBlog && " Создайте первый пост!"}
            </Typography.Text>
          </div>
        )}

        {/* Пагинация для постов */}
        {postsPagination.total > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: 24,
            padding: '16px 0'
          }}>
            <Pagination
              current={postsPagination.current}
              pageSize={postsPagination.pageSize}
              total={postsPagination.total}
              onChange={handlePostsPageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} из ${total} постов`
              }
              size="default"
              pageSizeOptions={['5', '10', '20', '50']}
            />
          </div>
        )}
      </Card>

      {/* Модальное окно создания поста */}
      <Modal open={openCreatePost} onCancel={() => setOpenCreatePost(false)} footer={null} title="Создать пост" destroyOnClose>
        <Form layout="vertical" onFinish={handleCreatePost}>
          <Form.Item name="title" label="Заголовок" rules={[{ required: true, min: 2, max: 30 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shortDescription" label="Краткое описание" rules={[{ required: true, min: 3, max: 50 }]}>
            <Input.TextArea rows={2} placeholder="Краткое описание поста (3-50 символов)" />
          </Form.Item>
          <Form.Item name="content" label="Содержание" rules={[{ required: true, min: 5, max: 1000 }]}>
            <Input.TextArea rows={6} placeholder="Полное содержание поста (5-1000 символов)" />
          </Form.Item>
          <Space>
            <Button onClick={() => setOpenCreatePost(false)}>Отмена</Button>
            <Button type="primary" htmlType="submit">Создать</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}


