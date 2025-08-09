import React from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await register(values.email, values.password);
      message.success('Регистрация успешно выполнена!');
      navigate('/rate', { replace: true });
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка регистрации');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 360 }} title="Регистрация">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
            <Input.Password placeholder="••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Создать аккаунт</Button>
          </Form.Item>
          <Typography.Paragraph>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
