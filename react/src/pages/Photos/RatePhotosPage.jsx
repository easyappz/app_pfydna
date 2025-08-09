import React from 'react';
import { Button, Card, Empty, Image, Rate, Space, Typography, Alert } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNext, createRating } from '../../api/ratings';

export default function RatePhotosPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ratings', 'next'],
    queryFn: () => getNext(),
    retry: 0,
  });

  const mutation = useMutation({
    mutationFn: ({ photoId, value }) => createRating({ photoId, value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      refetch();
    },
  });

  const photo = data?.photo;
  const owner = data?.owner;

  return (
    <Card title="Оценка фотографий" loading={isLoading}>
      {isError && (
        <Alert type="warning" message="Фотографий для оценки не найдено по текущим фильтрам" showIcon style={{ marginBottom: 16 }} />
      )}

      {!photo ? (
        <Empty description="Нет фотографий для оценки" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, justifyItems: 'center' }}>
          <Image src={photo.dataBase64} alt="photo for rating" style={{ maxHeight: 420, objectFit: 'contain' }} />
          <Space direction="vertical" size={8} style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">Пол: {owner?.gender || 'не указан'}</Typography.Text>
            <Typography.Text type="secondary">Возраст: {owner?.age ?? 'не указан'}</Typography.Text>
          </Space>
          <Space direction="vertical" align="center">
            <Typography.Text>Поставьте оценку от 1 до 5</Typography.Text>
            <Rate
              count={5}
              onChange={(value) => mutation.mutate({ photoId: photo.id, value })}
              disabled={mutation.isPending}
            />
            <Button onClick={() => refetch()} disabled={mutation.isPending}>
              Пропустить
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
}
