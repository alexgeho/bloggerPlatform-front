import { Typography, Card, Space, Row, Col, Spin, Pagination } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import type { Blog, ApiResponse } from '../types';
import { blogsApi } from "../api/blogs";

/**
 * Главная страница приложения
 * Отображает все блоги в виде карточек для всех пользователей
 * Незарегистрированные пользователи видят предупреждение о необходимости авторизации для комментариев
 */
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Состояние для пагинации
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pagesCount: 1
  });

  /**
   * Загружает блоги с сервера с учетом пагинации
   * Обновляет состояние loading во время запроса
   */
  const loadBlogs = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const data: ApiResponse<Blog> = await blogsApi.getBlogs<Blog>(page, pageSize);
      setBlogs(data.items);
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
        total: data.totalCount,
        pagesCount: data.pagesCount
      });
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработчик изменения страницы пагинации
   */
  const handlePageChange = (page: number, pageSize: number) => {
    loadBlogs(page, pageSize);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Показываем загрузку пока проверяется авторизация или загружаются блоги
  if (isLoading || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: 16
      }}>
        <Spin size="large" />
        <Typography.Text type="secondary">Загрузка блогов...</Typography.Text>
      </div>
    );
  }

  // Показываем блоги для всех пользователей
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Typography.Title level={2}>Все блоги</Typography.Title>
        {!isAuthenticated && (
          <Typography.Paragraph style={{ marginTop: 8, color: '#666' }}>
            Для добавления комментариев необходимо авторизоваться
          </Typography.Paragraph>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {blogs.map((blog) => (
          <Col xs={24} sm={12} md={8} lg={6} key={blog.id}>
            <Card
              hoverable
              style={{ 
                height: '100%', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate(`/blogs/${blog.id}`)}
              cover={
                <div style={{ 
                  height: 140, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <Typography.Title level={1} style={{ color: 'white', margin: 0 }}>
                    {blog.name.charAt(0).toUpperCase()}
                  </Typography.Title>
                </div>
              }
            >
              <Card.Meta
                title={
                  <Typography.Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                    {blog.name}
                  </Typography.Title>
                }
                description={
                  <div>
                    <Typography.Paragraph 
                      ellipsis={{ rows: 3 }}
                      style={{ marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}
                    >
                      {blog.description || 'Без описания'}
                    </Typography.Paragraph>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Создан: {new Date(blog.createdAt).toLocaleDateString()}
                      </Typography.Text>
                      {blog.websiteUrl && (
                        <Typography.Link 
                          href={blog.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: 12 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          🌐 {blog.websiteUrl}
                        </Typography.Link>
                      )}
                      {blog.isMembership && (
                        <Typography.Text type="success" style={{ fontSize: 12 }}>
                          Премиум блог
                        </Typography.Text>
                      )}
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {blogs.length === 0 && !loading && (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <Typography.Text type="secondary" style={{ fontSize: 16 }}>
            Пока нет блогов. Будьте первым!
          </Typography.Text>
        </Card>
      )}

      {/* Пагинация */}
      {pagination.total > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: 32,
          padding: '16px 0'
        }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} из ${total} блогов`
            }
            size="default"
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      )}
    </div>
  );
}