import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API } from "../api";
import { useAuth } from "../contexts/AuthContext";

import { Card, Typography, Space, Button, Form, Input, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import type { Post, Comment } from '../types';

/**
 * Страница отдельного поста
 * Отображает полное содержимое поста и комментарии
 * Позволяет авторизованным пользователям добавлять комментарии
 * Позволяет админу редактировать/удалять пост и комментарии
 */
export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Проверяем права доступа пользователя
  const { isAdmin, isAuthenticated } = useAuth();
  const canEdit = isAdmin();

  // Проверяем, находимся ли в режиме редактирования
  const editMode = useMemo(() => searchParams.get("edit") === "1", [searchParams]);

  /**
   * Загружает данные поста и его комментариев
   * Вызывается при изменении id поста
   */
  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await API.post.getPost<Post>(id);
      setPost(data);
      const c = await API.post.getComments<Comment>(id);
      setComments(c);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при изменении id
  useEffect(() => {
    load();
  }, [id]);

  // Переключаемся в режим редактирования, если указан параметр edit
  useEffect(() => {
    if (editMode) setEditing(true);
  }, [editMode]);

  /**
   * Обработчик обновления поста
   * Сохраняет изменения поста и обновляет данные
   */
  const handleUpdate = async (values: { title: string; shortDescription: string; content: string }) => {
    if (!id || !post?.blogId) return;
    await API.post.updatePost(id, {
      ...values,
      blogId: post.blogId
    });
    message.success("Пост обновлен");
    setEditing(false);
    await load();
  };

  /**
   * Обработчик удаления поста
   * Удаляет пост с сервера и возвращается на предыдущую страницу
   */
  const handleDelete = async () => {
    if (!id) return;
    await API.post.deletePost(id);
    message.success("Пост удален");
    navigate(-1);
  };

  /**
   * Обработчик добавления комментария
   * Создает новый комментарий и обновляет список комментариев
   */
  const handleAddComment = async (values: { content: string }) => {
    if (!id) return;
    await API.post.addComment(id, values);
    message.success("Комментарий добавлен");
    await load();
  };

  // Обработчик удаления комментария
  const handleDeleteComment = async (commentId: string) => {
    await API.post.deleteComment(commentId);
    message.success("Комментарий удален");
    await load();
  };

  if (!id) return null;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      <Card 
        loading={loading} 
        style={{
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Красивая обложка поста */}
        <div style={{
          height: 200,
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
          
          {/* Кнопки управления для админа */}
          {canEdit && (
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10
            }}>
              <Space>
                <Button 
                  type="primary"
                  icon={<EditOutlined />} 
                  onClick={() => setEditing(true)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Popconfirm 
                  title="Удалить этот пост?" 
                  onConfirm={handleDelete} 
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    danger
                    icon={<DeleteOutlined />} 
                    style={{ 
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Popconfirm>
              </Space>
            </div>
          )}
          
          {/* Заголовок поста на обложке */}
          <div style={{
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            zIndex: 1,
            padding: '0 24px'
          }}>
            <Typography.Title 
              level={1} 
              style={{ 
                color: 'white', 
                margin: 0,
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                fontSize: '2.5rem',
                fontWeight: 700
              }}
            >
              {post?.title}
            </Typography.Title>
            {post?.shortDescription && (
              <Typography.Paragraph 
                style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: 18,
                  margin: '16px 0 0 0',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {post.shortDescription}
              </Typography.Paragraph>
            )}
          </div>
        </div>
        
        {/* Основной контент */}
        <div style={{ padding: '32px' }}>
        {!editing ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Метаданные поста */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 0',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: 24
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#666'
              }}>
                <span style={{ fontSize: 14 }}>📅</span>
                <Typography.Text type="secondary">
                  {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                </Typography.Text>
              </div>
              {post?.blogName && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#666'
                }}>
                  <span style={{ fontSize: 14 }}>📝</span>
                  <Typography.Text type="secondary">
                    {post.blogName}
                  </Typography.Text>
                </div>
              )}
            </div>

            {/* Содержание поста */}
            <div style={{
              fontSize: 18,
              lineHeight: 1.8,
              color: '#2c3e50',
              marginBottom: 32
            }}>
              {post?.content}
            </div>



            {/* Разделитель */}
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, #e8e8e8, transparent)',
              margin: '32px 0'
            }} />

            {/* Комментарии */}
            <div>
              <Typography.Title level={3} style={{ 
                margin: 0, 
                marginBottom: 24,
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                💬 Комментарии ({comments.length})
              </Typography.Title>
              
              {comments.length > 0 ? (
                <div style={{ marginBottom: 24 }}>
                  {comments.map((comment: Comment) => (
                    <div key={comment.id} style={{
                      padding: '16px',
                      marginBottom: 16,
                      background: '#fafafa',
                      borderRadius: 12,
                      border: '1px solid #f0f0f0',
                      position: 'relative'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 600
                          }}>
                            {(comment.commentatorInfo?.userLogin || "А")[0].toUpperCase()}
                          </div>
                          <div>
                            <Typography.Text strong style={{ color: '#2c3e50' }}>
                              {comment.commentatorInfo?.userLogin || "Аноним"}
                            </Typography.Text>
                            <div>
                              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </Typography.Text>
                            </div>
                          </div>
                        </div>
                        {isAdmin() && (
                          <Popconfirm 
                            title="Удалить этот комментарий?" 
                            onConfirm={() => handleDeleteComment(comment.id)}
                          >
                            <Button 
                              danger 
                              size="small"
                              style={{ borderRadius: 6 }}
                            >
                              Удалить
                            </Button>
                          </Popconfirm>
                        )}
                      </div>
                      <Typography.Paragraph style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: '#34495e'
                      }}>
                        {comment.content}
                      </Typography.Paragraph>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: '#999',
                  fontSize: 16
                }}>
                  Пока нет комментариев. Будьте первым!
                </div>
              )}

              {/* Форма добавления комментария */}
              {isAuthenticated ? (
                <Card 
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  title={
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#2c3e50'
                    }}>
                      ✍️ Добавить комментарий
                    </div>
                  }
                >
                  <Form layout="vertical" onFinish={handleAddComment}>
                    <Form.Item 
                      name="content" 
                      rules={[
                        { required: true, message: 'Введите комментарий' },
                        { min: 20, message: 'Комментарий должен содержать минимум 20 символов' },
                        { max: 300, message: 'Комментарий не должен превышать 300 символов' }
                      ]}
                    >
                      <Input.TextArea 
                        rows={4} 
                        placeholder="Напишите ваш комментарий (минимум 20 символов)..." 
                        maxLength={300}
                        showCount
                        style={{
                          borderRadius: 8,
                          border: '1px solid #d9d9d9'
                        }}
                      />
                    </Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      style={{
                        borderRadius: 8,
                        height: 40,
                        fontWeight: 500
                      }}
                    >
                      Отправить комментарий
                    </Button>
                  </Form>
                </Card>
              ) : (
                <Card 
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e8e8e8',
                    background: '#fafafa'
                  }}
                  title={
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#2c3e50'
                    }}>
                      🔒 Комментарии
                    </div>
                  }
                >
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: '#666'
                  }}>
                    <Typography.Paragraph style={{ margin: 0, fontSize: 16 }}>
                      Для добавления комментариев необходимо 
                      <Button 
                        type="link" 
                        onClick={() => navigate("/login")} 
                        style={{ 
                          padding: 0, 
                          height: 'auto',
                          fontSize: 16,
                          fontWeight: 500
                        }}
                      >
                        войти в систему
                      </Button>
                    </Typography.Paragraph>
                  </div>
                </Card>
              )}
            </div>
        </Space>
      ) : (
        <div style={{ padding: '24px 0' }}>
          <Typography.Title level={3} style={{ marginBottom: 24, color: '#2c3e50' }}>
            Редактирование поста
          </Typography.Title>
          <Form layout="vertical" initialValues={{ title: post?.title, shortDescription: post?.shortDescription, content: post?.content }} onFinish={handleUpdate}>
            <Form.Item label="Заголовок" name="title" rules={[{ required: true, min: 2, max: 30 }]}>
              <Input style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item label="Краткое описание" name="shortDescription" rules={[{ required: true, min: 3, max: 50 }]}>
              <Input.TextArea rows={2} style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item label="Содержание" name="content" rules={[{ required: true, min: 5, max: 1000 }]}>
              <Input.TextArea rows={8} style={{ borderRadius: 8 }} />
            </Form.Item>
            <Space>
              <Button 
                onClick={() => setEditing(false)}
                style={{ borderRadius: 8 }}
              >
                Отмена
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ borderRadius: 8 }}
              >
                Сохранить
              </Button>
            </Space>
          </Form>
        </div>
      )}
        </div>
      </Card>
    </div>
  );
}


