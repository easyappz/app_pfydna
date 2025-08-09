import React, { useCallback, useMemo, useState } from 'react';
import { Card, Button, Empty, Space, Typography, Rate, Alert, Skeleton, notification } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ratingsApi from '../../api/ratings';
import getErrorMessage from '../../utils/getErrorMessage';

function useNextPhoto() {
  return useQuery({
    queryKey: ['next-photo'],
    queryFn: async () => {
      const { data } = await ratingsApi.next();
      return data;
    },
    retry: false,
  });
}

export default function RatePhotosPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useNextPhoto();
  const [value, setValue] = useState(0);

  const photo = data?.photo;
  const owner = data?.owner;

  const imgSrc = useMemo(() => {
    if (!photo?.dataBase64) return '';
    const hasPrefix = photo.dataBase64.startsWith('data:');
    if (hasPrefix) return photo.dataBase64;
    const mt = photo.mimeType || 'image/jpeg';
    return `data:${mt};base64,${photo.dataBase64}`;
  }, [photo]);

  const { mutate: rate, isLoading: isSubmitting } = useMutation({
    mutationFn: async (ratingValue) => {
      const payload = { photoId: photo.id, value: ratingValue };
      const { data: res } = await ratingsApi.create(payload);
      return res;
    },
    onSuccess: () => {
      notification.success({ message: 'Оценка сохранена', description: 'Спасибо за вашу оценку!' });
      setValue(0);
      qc.invalidateQueries({ queryKey: ['next-photo'] });
    },
    onError: (e) => {
      notification.error({ message: 'Ошибка', description: getErrorMessage(e) });
    },
  });

  const reload = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['next-photo'] });
  }, [qc]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 560 }} title="Оценка фотографий" extra={<Button onClick={reload}>Другую</Button>}>
        {isLoading && (
          <>
            <Skeleton.Image style={{ width: '100%', height: 300, marginBottom: 16 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
          </>
        )}

        {!isLoading && isError && (
          <Alert type="error" message={getErrorMessage(error)} style={{ marginBottom: 16 }} />
        )}

        {!isLoading && !photo && !isError && (
          <Empty description="Нет подходящих фото" />
        )}

        {photo && (
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <div style={{ width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 8, background: '#fafafa' }}>
              {imgSrc ? (
                <img src={imgSrc} alt="Фото для оценки" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <Empty description="Нет изображения" />
              )}
            </div>
            <Typography.Text type="secondary">Владелец: {owner?.id || 'неизвестно'}{owner?.gender ? ` • ${owner.gender}` : ''}{typeof owner?.age === 'number' ? ` • ${owner.age} лет` : ''}</Typography.Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Rate allowClear={false} value={value} onChange={setValue} />
              <Button type="primary" disabled={!value} loading={isSubmitting} onClick={() => rate(value)}>Оценить</Button>
              <Button onClick={reload}>Пропустить</Button>
            </div>
          </Space>
        )}
      </Card>
    </div>
  );
}
