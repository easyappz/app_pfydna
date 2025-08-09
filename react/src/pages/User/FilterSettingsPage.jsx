import React, { useEffect } from 'react';
import { Card, Form, Select, InputNumber, Button, Space, Typography, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateFilterSettings } from '../../api/users';

const genderOptions = [
  { value: 'any', label: 'Любой' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'other', label: 'Другое' },
];

const FilterSettingsPage = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['users', 'me'], queryFn: getMyProfile });
  const profile = data?.user;

  useEffect(() => {
    if (!profile) return;
    form.setFieldsValue({
      gender: profile.filterSettings?.gender ?? 'any',
      ageFrom: profile.filterSettings?.ageFrom ?? null,
      ageTo: profile.filterSettings?.ageTo ?? null,
    });
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: (payload) => updateFilterSettings(payload),
    onSuccess: () => {
      message.success('Фильтры обновлены');
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: (e) => {
      message.error(e?.response?.data?.error || 'Не удалось сохранить фильтры');
    },
  });

  const onSave = async () => {
    const values = await form.validateFields();
    if (
      typeof values.ageFrom === 'number' &&
      typeof values.ageTo === 'number' &&
      values.ageFrom > values.ageTo
    ) {
      message.error('Возраст "от" не может быть больше возраста "до"');
      return;
    }
    await mutation.mutateAsync({
      gender: values.gender,
      ageFrom: typeof values.ageFrom === 'number' ? values.ageFrom : null,
      ageTo: typeof values.ageTo === 'number' ? values.ageTo : null,
    });
  };

  return (
    <Card title="Настройки фильтров" loading={isLoading}>
      <Form form={form} layout="vertical">
        <Form.Item label="Пол владельца" name="gender">
          <Select options={genderOptions} />
        </Form.Item>
        <Form.Item label="Возраст от" name="ageFrom">
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Минимальный возраст" />
        </Form.Item>
        <Form.Item label="Возраст до" name="ageTo">
          <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Максимальный возраст" />
        </Form.Item>
        <Space>
          <Button type="primary" onClick={onSave}>Сохранить</Button>
        </Space>
      </Form>
      <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
        Эти фильтры используются по умолчанию для подбора фотографий на странице «Оценка».
      </Typography.Paragraph>
    </Card>
  );
};

export default FilterSettingsPage;
