import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      const to = location.state?.from?.pathname || '/rate';
      message.success('Добро пожаловать!');
      navigate(to, { replace: true });
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card title="Авторизация" style={{ width: 380 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Неверный формат email' }]}>
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
            <Input.Password placeholder="••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Войти
          </Button>
        </Form>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text type="secondary">
            Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </Typography.Text>
          <Typography.Text>
            <Link to="/password-reset">Забыли пароль?</Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
