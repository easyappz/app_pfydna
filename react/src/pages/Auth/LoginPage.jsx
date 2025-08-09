import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authLogin } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await authLogin(values);
      setSession(res.token, res.user);
      message.success('Добро пожаловать!');
      navigate(from, { replace: true });
    } catch (e) {
      message.error(e?.response?.data?.error || 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Card title="Вход" style={{ width: 380 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }]}> 
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }]}> 
            <Input.Password placeholder="••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Войти
          </Button>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <Typography.Text>
              Нет аккаунта? <Link to="/register">Регистрация</Link>
            </Typography.Text>
            <Typography.Text>
              <Link to="/password-reset">Забыли пароль?</Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
