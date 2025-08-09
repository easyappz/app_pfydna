import React, { useMemo } from 'react';
import { Layout, Menu, Tag, Typography, Space } from 'antd';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  UserOutlined,
  UploadOutlined,
  StarOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Content, Sider, Footer } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/profile')) return 'profile';
    if (location.pathname.startsWith('/upload')) return 'upload';
    if (location.pathname.startsWith('/rate')) return 'rate';
    if (location.pathname.startsWith('/stats')) return 'stats';
    if (location.pathname.startsWith('/filters')) return 'filters';
    return 'rate';
  }, [location.pathname]);

  const items = [
    { key: 'profile', icon: <UserOutlined />, label: 'Профиль', path: '/profile' },
    { key: 'upload', icon: <UploadOutlined />, label: 'Загрузка фото', path: '/upload' },
    { key: 'rate', icon: <StarOutlined />, label: 'Оценка', path: '/rate' },
    { key: 'stats', icon: <BarChartOutlined />, label: 'Статистика', path: '/stats' },
    { key: 'filters', icon: <SettingOutlined />, label: 'Настройки фильтров', path: '/filters' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 48, margin: 16, borderRadius: 6, background: 'rgba(255,255,255,0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => {
            const item = items.find((i) => i.key === e.key);
            if (item) navigate(item.path);
          }}
          items={items.map((i) => ({ key: i.key, icon: i.icon, label: i.label }))}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <Space size={16} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography.Title level={4} style={{ margin: 0 }}>Easyappz — Фото-оценки</Typography.Title>
            <Space>
              <Typography.Text type="secondary">
                {user?.name || user?.email || 'Гость'}
              </Typography.Text>
              <Tag color="blue">Баланс: {user?.points ?? 0}</Tag>
            </Space>
          </Space>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 16, minHeight: 'calc(100vh - 160px)', background: '#fff', borderRadius: 8 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} Easyappz
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
