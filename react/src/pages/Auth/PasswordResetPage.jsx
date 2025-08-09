import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, Space, message } from 'antd';
import { Link } from 'react-router-dom';
import { requestReset, resetPassword } from '../../api/auth';

export default function PasswordResetPage() {
  const [loadingReq, setLoadingReq] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [testCode, setTestCode] = useState('');

  const onRequest = async (values) => {
    setLoadingReq(true);
    try {
      const res = await requestReset(values);
      message.success(res.message || 'Код отправлен');
      if (res.code) setTestCode(res.code);
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка запроса');
    } finally {
      setLoadingReq(false);
    }
  };

  const onReset = async (values) => {
    setLoadingReset(true);
    try {
      const res = await resetPassword(values);
      message.success(res.message || 'Пароль обновлён');
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка восстановления');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card title="Восстановление пароля" style={{ width: 520 }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={5} style={{ marginTop: 0 }}>Шаг 1. Запросить код</Typography.Title>
            <Form layout="vertical" onFinish={onRequest}>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Неверный email' }]}>
                <Input placeholder="you@example.com" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loadingReq}>Получить код</Button>
              {testCode && (
                <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
                  Тестовый код: <Typography.Text code>{testCode}</Typography.Text>
                </Typography.Paragraph>
              )}
            </Form>
          </div>

          <div>
            <Typography.Title level={5} style={{ marginTop: 0 }}>Шаг 2. Сброс пароля</Typography.Title>
            <Form layout="vertical" onFinish={onReset}>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Неверный email' }]}>
                <Input placeholder="you@example.com" />
              </Form.Item>
              <Form.Item name="code" label="Код из письма" rules={[{ required: true, message: 'Введите код' }]}>
                <Input placeholder="6 цифр" />
              </Form.Item>
              <Form.Item name="newPassword" label="Новый пароль" rules={[{ required: true, message: 'Введите новый пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
                <Input.Password placeholder="••••••" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loadingReset}>Обновить пароль</Button>
            </Form>
          </div>

          <Typography.Text type="secondary">
            Вспомнили пароль? <Link to="/login">Вернуться к входу</Link>
          </Typography.Text>
        </Space>
      </Card>
    </div>
  );
}
