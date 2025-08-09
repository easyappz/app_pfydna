import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Регистрация успешна!');
      navigate('/rate', { replace: true });
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card title="Регистрация" style={{ width: 420 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Неверный email' }]}>
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
            <Input.Password placeholder="••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Создать аккаунт
          </Button>
        </Form>
        <div style={{ marginTop: 12 }}>
          <Typography.Text type="secondary">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
