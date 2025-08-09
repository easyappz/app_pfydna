import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import getErrorMessage from '../../utils/getErrorMessage';

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/rate';

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      await login(values.email.trim(), values.password);
      notification.success({ message: 'Успешный вход', description: 'Добро пожаловать!' });
      navigate(from, { replace: true });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card style={{ width: 400 }} title="Вход в аккаунт">
        {error ? <Alert type="error" message={error} style={{ marginBottom: 16 }} /> : null}
        <Form layout="vertical" form={form} onFinish={onFinish} disabled={loading}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="example@mail.com" autoFocus />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }]}> 
            <Input.Password placeholder="Ваш пароль" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Войти</Button>
        </Form>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </Typography.Text>
          <Typography.Text>
            <Link to="/password-reset">Забыли пароль?</Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
