import React, { useEffect } from 'react';
import { Button, Card, Form, Input, Select, InputNumber, message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { updateMyProfile } from '../../api/users';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: user?.name || '',
      gender: user?.gender || null,
      age: user?.age != null ? user.age : null,
    });
  }, [user, form]);

  const onFinish = async (values) => {
    try {
      const payload = {
        name: values.name === '' ? null : values.name,
        gender: values.gender || null,
        age: values.age == null ? null : Number(values.age),
      };
      const res = await updateMyProfile(payload);
      if (res?.user) setUser(res.user);
      message.success('Профиль обновлён');
    } catch (e) {
      message.error(e?.response?.data?.error || 'Не удалось обновить профиль');
    }
  };

  return (
    <Card title="Профиль">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Имя" name="name">
          <Input placeholder="Ваше имя" maxLength={100} />
        </Form.Item>
        <Form.Item label="Пол" name="gender">
          <Select allowClear placeholder="Не указан" options={[{ value: 'male', label: 'Мужской' }, { value: 'female', label: 'Женский' }, { value: 'other', label: 'Другое' }]} />
        </Form.Item>
        <Form.Item label="Возраст" name="age">
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Не указан" />
        </Form.Item>
        <Button type="primary" htmlType="submit">Сохранить</Button>
      </Form>
    </Card>
  );
}
