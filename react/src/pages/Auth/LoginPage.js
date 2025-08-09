import React from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const from = location.state?.from?.pathname || '/rate';

  const onFinish = async (values) => {
    try {
      await login(values.email, values.password);
      message.success('Добро пожаловать!');
      navigate(from, { replace: true });
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка авторизации');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 360 }} title="Вход">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
            <Input.Password placeholder="••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Войти</Button>
          </Form.Item>
          <Typography.Paragraph style={{ marginBottom: 8 }}>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </Typography.Paragraph>
          <Typography.Paragraph>
            Забыли пароль? <Link to="/password-reset">Сбросить</Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
