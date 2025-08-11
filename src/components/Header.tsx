import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from '../assets/logo.png';

const { Header: AntHeader } = Layout;

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Проверяем, является ли текущий пользователь админом
  const isAdmin = user?.login === 'admin';

  return (
    <AntHeader style={{ 
      background: '#f2ebdd', 
      borderBottom: '1px solid #f0f0f0',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Логотип и основная навигация */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button 
          type="text" 
          size="large"
          style={{ 
            fontSize: 16, 
            fontWeight: 'bold',
            outline: 'none',
            border: 'none',
            padding: 0,
            height: 'auto'
          }}
          onClick={() => navigate("/")}
        >
          <img 
            src={logo} 
            alt="BloggerPlatform" 
            style={{ 
              height: 60, 
              width: 'auto',
              marginRight: 8
            }} 
          />
          BloggerPlatform
        </Button>
      </div>

      {/* Информация о пользователе */}
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#666' }}>
            {user?.login}
            {isAdmin && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>(Админ)</span>}
          </span>
        </div>
      )}
    </AntHeader>
  );
}