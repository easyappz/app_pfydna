import React, { useEffect } from 'react';
import { Button, Card, Form, Radio, InputNumber, Space, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { updateFilterSettings } from '../../api/users';
import { useAuth } from '../../context/AuthContext';

export default function FilterSettingsPage() {
  const { user, refetchUser } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      gender: user?.filterSettings?.gender || 'any',
      ageFrom: user?.filterSettings?.ageFrom ?? null,
      ageTo: user?.filterSettings?.ageTo ?? null,
    });
  }, [user, form]);

  const { mutateAsync, isPending } = useMutation({ mutationFn: updateFilterSettings });

  const onFinish = async (values) => {
    try {
      await mutateAsync(values);
      message.success('Фильтры обновлены');
      refetchUser();
    } catch (e) {
      message.error(e?.response?.data?.error || 'Ошибка обновления фильтров');
    }
  };

  return (
    <Card title="Настройки фильтров">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Пол владельца" name="gender">
          <Radio.Group>
            <Radio.Button value="any">Любой</Radio.Button>
            <Radio.Button value="male">Мужской</Radio.Button>
            <Radio.Button value="female">Женский</Radio.Button>
            <Radio.Button value="other">Другое</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Возраст (от и до)">
          <Space>
            <Form.Item name="ageFrom" noStyle>
              <InputNumber placeholder="От" min={0} max={120} />
            </Form.Item>
            <Form.Item name="ageTo" noStyle>
              <InputNumber placeholder="До" min={0} max={120} />
            </Form.Item>
          </Space>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>Сохранить</Button>
      </Form>
    </Card>
  );
}
