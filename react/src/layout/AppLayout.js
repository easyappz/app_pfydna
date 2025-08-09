import React, { useMemo } from 'react';
import { Layout, Menu, Typography, Button, Avatar, theme } from 'antd';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { PictureOutlined, UploadOutlined, BarChartOutlined, UserOutlined, SlidersOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content, Footer } = Layout;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/rate')) return 'rate';
    if (location.pathname.startsWith('/upload')) return 'upload';
    if (location.pathname.startsWith('/stats')) return 'stats';
    if (location.pathname.startsWith('/profile')) return 'profile';
    if (location.pathname.startsWith('/filters')) return 'filters';
    return 'rate';
  }, [location.pathname]);

  const items = [
    { key: 'rate', icon: <PictureOutlined />, label: <Link to="/rate">Оценка фотографий</Link> },
    { key: 'upload', icon: <UploadOutlined />, label: <Link to="/upload">Загрузка фото</Link> },
    { key: 'stats', icon: <BarChartOutlined />, label: <Link to="/stats">Статистика</Link> },
    { key: 'profile', icon: <UserOutlined />, label: <Link to="/profile">Профиль</Link> },
    { key: 'filters', icon: <SlidersOutlined />, label: <Link to="/filters">Фильтры</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
          Easyappz
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer, padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography.Title level={4} style={{ margin: 0 }}>Галерея оценок</Typography.Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar icon={<UserOutlined />} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontWeight: 600 }}>{user?.email}</span>
                <span style={{ color: '#888' }}>{typeof user?.points === 'number' ? `Баллы: ${user.points}` : ''}</span>
              </div>
              <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login'); }}>Выйти</Button>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 16,
              minHeight: 'calc(100vh - 64px - 32px - 70px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Easyappz © {new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
}
