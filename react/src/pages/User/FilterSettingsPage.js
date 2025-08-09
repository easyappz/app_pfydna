import React, { useEffect } from 'react';
import { Button, Card, Form, InputNumber, Select, Space, Typography, message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { updateFilterSettings } from '../../api/users';

export default function FilterSettingsPage() {
  const { user, setUser } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    const f = user?.filterSettings || {};
    form.setFieldsValue({
      gender: f.gender || 'any',
      ageFrom: f.ageFrom != null ? f.ageFrom : null,
      ageTo: f.ageTo != null ? f.ageTo : null,
    });
  }, [user, form]);

  const onFinish = async (values) => {
    const payload = {
      gender: values.gender,
      ageFrom: values.ageFrom == null ? null : Number(values.ageFrom),
      ageTo: values.ageTo == null ? null : Number(values.ageTo),
    };

    if (payload.ageFrom != null && payload.ageTo != null && payload.ageFrom > payload.ageTo) {
      message.error('Возраст «От» не может быть больше «До»');
      return;
    }

    try {
      const res = await updateFilterSettings(payload);
      if (res?.user) {
        setUser(res.user);
      }
      message.success('Настройки фильтров сохранены');
    } catch (e) {
      message.error(e?.response?.data?.error || 'Не удалось сохранить');
    }
  };

  return (
    <Card title="Настройки фильтров">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Пол" name="gender" rules={[{ required: true, message: 'Выберите пол' }]}>
          <Select
            options={[
              { value: 'any', label: 'Любой' },
              { value: 'male', label: 'Мужчины' },
              { value: 'female', label: 'Женщины' },
              { value: 'other', label: 'Другое' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Возраст от" name="ageFrom">
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Не ограничено" />
        </Form.Item>
        <Form.Item label="Возраст до" name="ageTo">
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Не ограничено" />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit">Сохранить</Button>
          <Typography.Text type="secondary">Эти фильтры будут применяться при поиске следующего фото.</Typography.Text>
        </Space>
      </Form>
    </Card>
  );
}
