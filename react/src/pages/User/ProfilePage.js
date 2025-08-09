import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, message } from 'antd';
import usersApi from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import getErrorMessage from '../../utils/getErrorMessage';

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    form.setFieldsValue({
      name: user?.name || '',
      gender: user?.gender || null,
      age: typeof user?.age === 'number' ? user.age : null,
    });
  }, [user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: (values.name || '').trim(),
        gender: values.gender || null,
        age: typeof values.age === 'number' ? values.age : null,
      };
      await usersApi.updateMe(payload);
      await refreshProfile();
      message.success('Профиль обновлён');
    } catch (e) {
      message.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Профиль">
      <Form layout="vertical" form={form} onFinish={onFinish} disabled={loading}>
        <Form.Item label="Имя" name="name">
          <Input placeholder="Ваше имя" />
        </Form.Item>
        <Form.Item label="Пол" name="gender">
          <Select allowClear placeholder="Выберите пол">
            <Select.Option value="male">Мужской</Select.Option>
            <Select.Option value="female">Женский</Select.Option>
            <Select.Option value="other">Другой</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Возраст" name="age" rules={[({ getFieldValue }) => ({
          validator(_, v) {
            if (v == null) return Promise.resolve();
            if (Number.isInteger(v) && v >= 0 && v <= 120) return Promise.resolve();
            return Promise.reject(new Error('Введите целое число от 0 до 120'));
          },
        })]}>
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Возраст" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Сохранить</Button>
      </Form>
    </Card>
  );
}
