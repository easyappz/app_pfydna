import React, { useEffect } from 'react';
import { Button, Card, Form, Input, Radio, InputNumber, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '../../api/users';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: user?.name || '',
      gender: user?.gender || null,
      age: user?.age ?? null,
    });
  }, [user, form]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateProfile,
  });

  const onFinish = async (values) => {
    try {
      await mutateAsync(values);
      message.success('Профиль обновлён');
      refetchUser();
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка обновления профиля');
    }
  };

  return (
    <Card title="Профиль пользователя">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Имя" name="name">
          <Input placeholder="Ваше имя" />
        </Form.Item>
        <Form.Item label="Пол" name="gender">
          <Radio.Group>
            <Radio.Button value="male">Мужской</Radio.Button>
            <Radio.Button value="female">Женский</Radio.Button>
            <Radio.Button value="other">Другое</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Возраст" name="age">
          <InputNumber placeholder="Возраст" min={0} max={120} style={{ width: 160 }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Сохранить
        </Button>
      </Form>
    </Card>
  );
}
