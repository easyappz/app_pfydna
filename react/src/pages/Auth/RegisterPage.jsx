import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authRegister } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await authRegister(values);
      setSession(res.token, res.user);
      message.success('Регистрация успешна!');
      navigate('/profile', { replace: true });
    } catch (e) {
      message.error(e?.response?.data?.error || 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Card title="Регистрация" style={{ width: 420 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }]}> 
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль (минимум 6 символов)' }]}> 
            <Input.Password placeholder="Минимум 6 символов" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Зарегистрироваться
          </Button>
          <div style={{ marginTop: 12 }}>
            <Typography.Text>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
