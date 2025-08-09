import React, { useEffect, useState } from 'react';
import { Card, Form, Select, InputNumber, Button, message } from 'antd';
import usersApi from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import getErrorMessage from '../../utils/getErrorMessage';

export default function FilterSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    const fs = user?.filterSettings || {};
    form.setFieldsValue({
      gender: fs.gender || 'any',
      ageFrom: typeof fs.ageFrom === 'number' ? fs.ageFrom : null,
      ageTo: typeof fs.ageTo === 'number' ? fs.ageTo : null,
    });
  }, [user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (typeof values.ageFrom === 'number' && typeof values.ageTo === 'number' && values.ageFrom > values.ageTo) {
        message.error('Возраст "от" не может быть больше возраста "до"');
        setLoading(false);
        return;
      }
      const payload = {
        gender: values.gender,
        ageFrom: typeof values.ageFrom === 'number' ? values.ageFrom : null,
        ageTo: typeof values.ageTo === 'number' ? values.ageTo : null,
      };
      await usersApi.updateFilterSettings(payload);
      await refreshProfile();
      message.success('Фильтры обновлены');
    } catch (e) {
      message.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Фильтры по умолчанию">
      <Form layout="vertical" form={form} onFinish={onFinish} disabled={loading}>
        <Form.Item label="Пол" name="gender" rules={[{ required: true, message: 'Выберите пол' }]}>
          <Select>
            <Select.Option value="any">Любой</Select.Option>
            <Select.Option value="male">Мужской</Select.Option>
            <Select.Option value="female">Женский</Select.Option>
            <Select.Option value="other">Другой</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Возраст от" name="ageFrom">
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Не задано" />
        </Form.Item>
        <Form.Item label="Возраст до" name="ageTo">
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Не задано" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Сохранить</Button>
      </Form>
    </Card>
  );
}
