import React, { useState } from 'react';
import { Button, Card, Form, Input, Space, message } from 'antd';
import { Link } from 'react-router-dom';
import { requestReset, resetPassword } from '../../api/auth';

export default function PasswordResetPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const onRequest = async (values) => {
    try {
      const res = await requestReset({ email: values.email });
      setEmail(values.email);
      setSent(true);
      message.success(res?.message || 'Код отправлен');
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка отправки кода');
    }
  };

  const onReset = async (values) => {
    try {
      await resetPassword({ email, code: values.code, newPassword: values.newPassword });
      message.success('Пароль обновлён, войдите с новым паролем');
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка сброса пароля');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 420 }} title="Сброс пароля" extra={<Link to="/login">Назад ко входу</Link>}>
        {!sent ? (
          <Form layout="vertical" onFinish={onRequest}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
              <Input placeholder="email@example.com" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Отправить код</Button>
            </Form.Item>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={onReset}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input value={email} disabled />
              <Form.Item label="Код" name="code" rules={[{ required: true, message: 'Введите код' }]}>
                <Input placeholder="6-значный код" />
              </Form.Item>
              <Form.Item label="Новый пароль" name="newPassword" rules={[{ required: true, message: 'Введите новый пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
                <Input.Password placeholder="••••••" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block>Обновить пароль</Button>
            </Space>
          </Form>
        )}
      </Card>
    </div>
  );
}
