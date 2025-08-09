import React, { useEffect, useMemo, useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Typography, Space, message, Divider } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const genderOptions = [
  { value: null, label: 'Не указано' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'other', label: 'Другое' },
];

const ProfilePage = () => {
  const [form] = Form.useForm();
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getMyProfile,
  });

  const profile = data?.user || user;

  useEffect(() => {
    if (!profile) return;
    form.setFieldsValue({
      name: profile.name ?? '',
      gender: profile.gender ?? null,
      age: profile.age ?? null,
    });
  }, [profile, form]);

  const dirty = useMemo(() => {
    const current = form.getFieldsValue();
    return (
      (profile?.name ?? '') !== (current.name ?? '') ||
      (profile?.gender ?? null) !== (current.gender ?? null) ||
      (profile?.age ?? null) !== (current.age ?? null)
    );
  }, [form, profile]);

  const mutation = useMutation({
    mutationFn: (payload) => updateMyProfile(payload),
    onSuccess: (res) => {
      message.success('Профиль обновлён');
      setUser(res.user);
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: (e) => {
      message.error(e?.response?.data?.error || 'Не удалось сохранить');
    },
  });

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const payload = {
        name: values.name ? values.name.trim() : null,
        gender: values.gender ?? null,
        age: typeof values.age === 'number' ? values.age : null,
      };
      await mutation.mutateAsync(payload);
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    logout();
    message.success('Вы вышли из аккаунта');
    navigate('/login', { replace: true });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>Ваш профиль</Typography.Title>
          <Typography.Text strong>Баллы: {profile?.points ?? 0}</Typography.Text>
        </Space>
        <Divider />
        <Form form={form} layout="vertical" disabled={isLoading}>
          <Form.Item label="Имя" name="name">
            <Input placeholder="Ваше имя" maxLength={100} />
          </Form.Item>
          <Form.Item label="Пол" name="gender">
            <Select options={genderOptions} placeholder="Выберите пол" allowClear />
          </Form.Item>
          <Form.Item label="Возраст" name="age">
            <InputNumber min={0} max={120} style={{ width: '100%' }} placeholder="Возраст" />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={onSave} loading={saving} disabled={!dirty}>
              Сохранить
            </Button>
            <Button danger onClick={onLogout}>Выход</Button>
          </Space>
        </Form>
      </Card>

      <Card>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Подсказка: заполните профиль, чтобы другим было проще оценивать ваши фотографии и чтобы фильтры работали точнее.
        </Typography.Paragraph>
      </Card>
    </Space>
  );
};

export default ProfilePage;
