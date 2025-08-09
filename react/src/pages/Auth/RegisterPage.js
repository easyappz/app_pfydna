import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import getErrorMessage from '../../utils/getErrorMessage';

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      await register(values.email.trim(), values.password);
      notification.success({ message: 'Регистрация успешна', description: 'Вы вошли в аккаунт' });
      navigate('/rate', { replace: true });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card style={{ width: 420 }} title="Создание аккаунта">
        {error ? <Alert type="error" message={error} style={{ marginBottom: 16 }} /> : null}
        <Form layout="vertical" form={form} onFinish={onFinish} disabled={loading}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="example@mail.com" autoFocus />
          </Form.Item>

          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]} hasFeedback>
            <Input.Password placeholder="Минимум 6 символов" />
          </Form.Item>

          <Form.Item label="Повторите пароль" name="confirm" dependencies={['password']} hasFeedback rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}>
            <Input.Password placeholder="Повторите пароль" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>Зарегистрироваться</Button>
        </Form>
        <div style={{ marginTop: 16 }}>
          <Typography.Text>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
