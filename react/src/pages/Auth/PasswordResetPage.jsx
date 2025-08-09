import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../../api/auth';

const PasswordResetPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [testCode, setTestCode] = useState('');

  const handleRequest = async (values) => {
    setLoading(true);
    try {
      const res = await requestPasswordReset({ email: values.email });
      setEmail(values.email);
      if (res && res.code) setTestCode(res.code);
      message.success('Код восстановления отправлен на вашу почту');
      setStep(2);
    } catch (e) {
      message.error(e?.response?.data?.error || 'Не удалось отправить код');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (values) => {
    setLoading(true);
    try {
      await resetPassword({ email, code: values.code, newPassword: values.newPassword });
      message.success('Пароль обновлён. Теперь можно войти.');
      setStep(3);
    } catch (e) {
      message.error(e?.response?.data?.error || 'Не удалось обновить пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
      <Card title="Восстановление пароля" style={{ width: 460 }} extra={<Link to="/login">Назад ко входу</Link>}>
        {step === 1 && (
          <Form layout="vertical" onFinish={handleRequest}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Некорректный email' },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Получить код
            </Button>
          </Form>
        )}

        {step === 2 && (
          <>
            {testCode && (
              <Alert style={{ marginBottom: 12 }} type="info" showIcon message={`Тестовый код: ${testCode}`} />
            )}
            <Form layout="vertical" onFinish={handleReset}>
              <Form.Item label="Email">
                <Input value={email} disabled />
              </Form.Item>
              <Form.Item
                label="Код"
                name="code"
                rules={[
                  { required: true, message: 'Введите код из письма' },
                  { min: 6, message: 'Код должен содержать 6 символов' },
                  { max: 6, message: 'Код должен содержать 6 символов' },
                ]}
              >
                <Input placeholder="6-значный код" />
              </Form.Item>
              <Form.Item
                label="Новый пароль"
                name="newPassword"
                rules={[
                  { required: true, message: 'Введите новый пароль' },
                  { min: 6, message: 'Минимум 6 символов' },
                ]}
              >
                <Input.Password placeholder="Минимум 6 символов" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Обновить пароль
              </Button>
            </Form>
          </>
        )}

        {step === 3 && (
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Пароль обновлён. Перейти на <Link to="/login">страницу входа</Link>.
          </Typography.Paragraph>
        )}
      </Card>
    </div>
  );
};

export default PasswordResetPage;
