import React, { useMemo } from 'react';
import { Layout, Menu, Typography, Button, Space, Tag } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StarFilled, UploadOutlined, BarChartOutlined, UserOutlined, FilterOutlined, LogoutOutlined, ThunderboltFilled } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/rate')) return 'rate';
    if (location.pathname.startsWith('/upload')) return 'upload';
    if (location.pathname.startsWith('/stats')) return 'stats';
    if (location.pathname.startsWith('/profile')) return 'profile';
    if (location.pathname.startsWith('/filters')) return 'filters';
    return 'rate';
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, letterSpacing: 0.3 }}>Easyappz</div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}
          items={[
            { key: 'rate', icon: <StarFilled />, label: <Link to="/rate">Оценка фото</Link> },
            { key: 'upload', icon: <UploadOutlined />, label: <Link to="/upload">Загрузка фото</Link> },
            { key: 'stats', icon: <BarChartOutlined />, label: <Link to="/stats">Статистика</Link> },
            { key: 'profile', icon: <UserOutlined />, label: <Link to="/profile">Профиль</Link> },
            { key: 'filters', icon: <FilterOutlined />, label: <Link to="/filters">Фильтры</Link> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 16 }}>
          <Space>
            <ThunderboltFilled style={{ color: '#faad14' }} />
            <Typography.Text strong>Баланс:</Typography.Text>
            <Tag color="gold">{user?.points ?? 0}</Tag>
          </Space>
          <Space>
            <Typography.Text type="secondary">{user?.email}</Typography.Text>
            <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login', { replace: true }); }}>Выйти</Button>
          </Space>
        </Header>
        <Content style={{ margin: 16 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, minHeight: 'calc(100vh - 64px - 32px)' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
