import React, { useMemo, useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Button, theme, Grid } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  StarOutlined,
  UploadOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content, Footer } = Layout;

export default function AppLayout() {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const screens = Grid.useBreakpoint();

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/rate')) return 'rate';
    if (location.pathname.startsWith('/upload')) return 'upload';
    if (location.pathname.startsWith('/stats')) return 'stats';
    if (location.pathname.startsWith('/profile')) return 'profile';
    if (location.pathname.startsWith('/filters')) return 'filters';
    return 'rate';
  }, [location.pathname]);

  const items = [
    { key: 'rate', icon: <StarOutlined />, label: 'Оценка фотографий', onClick: () => navigate('/rate') },
    { key: 'upload', icon: <UploadOutlined />, label: 'Загрузка фотографий', onClick: () => navigate('/upload') },
    { key: 'stats', icon: <BarChartOutlined />, label: 'Статистика фотографий', onClick: () => navigate('/stats') },
    { type: 'divider' },
    { key: 'profile', icon: <UserOutlined />, label: 'Профиль пользователя', onClick: () => navigate('/profile') },
    { key: 'filters', icon: <SettingOutlined />, label: 'Настройки фильтров', onClick: () => navigate('/filters') },
  ];

  const menu = (
    <Menu
      items={[
        { key: 'profile', icon: <UserOutlined />, label: 'Профиль', onClick: () => navigate('/profile') },
        { key: 'logout', icon: <LogoutOutlined />, danger: true, label: 'Выйти', onClick: logout },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={screens.lg ? 240 : 200}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 64, margin: 12, color: '#fff' }}>
          <ThunderboltOutlined style={{ fontSize: 24 }} />
          {!collapsed && <Typography.Title level={5} style={{ margin: 0, color: '#fff' }}>Easyappz</Typography.Title>}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>Галерея оценок</Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>{user?.name || user?.email}</div>
              <div style={{ fontSize: 12, color: '#999' }}>Баллы: {user?.points ?? 0}</div>
            </div>
            <Dropdown overlay={menu} trigger={['click']}>
              <Avatar style={{ backgroundColor: '#1677ff' }} size={40}>
                {(user?.name || user?.email || '?').slice(0, 1).toUpperCase()}
              </Avatar>
            </Dropdown>
            <Button onClick={logout} icon={<LogoutOutlined />} type="text">Выйти</Button>
          </div>
        </Header>
        <Content style={{ margin: 16 }}>
          <div style={{ padding: 16, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Easyappz · React + Node.js · {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
