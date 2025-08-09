import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Steps, Space, notification } from 'antd';
import authApi from '../../api/auth';
import getErrorMessage from '../../utils/getErrorMessage';
import { Link, useNavigate } from 'react-router-dom';

export default function PasswordResetPage() {
  const [step, setStep] = useState(0);
  const [formRequest] = Form.useForm();
  const [formReset] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [issuedCode, setIssuedCode] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const requestCode = async (values) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.requestReset({ email: values.email.trim() });
      setIssuedCode(data?.code || '');
      setEmail(values.email.trim());
      notification.success({ message: 'Код отправлен', description: 'Код также возвращён в ответе для теста' });
      setStep(1);
      formReset.setFieldsValue({ email: values.email.trim(), code: data?.code || '' });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (values) => {
    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword({ email: values.email.trim(), code: values.code.trim(), newPassword: values.newPassword });
      notification.success({ message: 'Пароль обновлён', description: 'Теперь войдите с новым паролем' });
      navigate('/login');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Card style={{ width: 520 }} title="Восстановление пароля">
        <Steps current={step} items={[{ title: 'Запрос кода' }, { title: 'Сброс пароля' }]} style={{ marginBottom: 16 }} />
        {error ? <Alert type="error" message={error} style={{ marginBottom: 16 }} /> : null}

        {step === 0 && (
          <Form layout="vertical" form={formRequest} onFinish={requestCode} disabled={loading}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
              <Input placeholder="example@mail.com" autoFocus />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Получить код</Button>
          </Form>
        )}

        {step === 1 && (
          <>
            {issuedCode ? (
              <Alert type="info" showIcon message={<span>Тестовый код: <strong>{issuedCode}</strong></span>} style={{ marginBottom: 16 }} />
            ) : null}
            <Form layout="vertical" form={formReset} onFinish={resetPassword} disabled={loading}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]} initialValue={email}>
                <Input />
              </Form.Item>
              <Form.Item label="Код из письма" name="code" rules={[{ required: true, message: 'Введите код' }]}>
                <Input placeholder="6-значный код" />
              </Form.Item>
              <Form.Item label="Новый пароль" name="newPassword" rules={[{ required: true, message: 'Введите новый пароль' }, { min: 6, message: 'Минимум 6 символов' }]} hasFeedback>
                <Input.Password placeholder="Минимум 6 символов" />
              </Form.Item>
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Button type="primary" htmlType="submit" loading={loading} block>Сбросить пароль</Button>
                <Button onClick={() => setStep(0)} block>Назад</Button>
              </Space>
            </Form>
          </>
        )}

        <div style={{ marginTop: 16 }}>
          <Typography.Text>
            Вспомнили пароль? <Link to="/login">Войти</Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
