import React from 'react';
import { Card, List, Typography, Tag, Skeleton, Empty } from 'antd';
import { useQuery } from '@tanstack/react-query';
import photosApi from '../../api/photos';
import getErrorMessage from '../../utils/getErrorMessage';

export default function PhotoStatsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['my-photos'],
    queryFn: async () => {
      const { data } = await photosApi.my();
      return data;
    },
  });

  const photos = data?.photos || [];

  return (
    <Card title="Мои фото и статистика">
      {isLoading && <Skeleton active paragraph={{ rows: 4 }} />}
      {isError && <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text>}
      {!isLoading && !isError && photos.length === 0 && <Empty description="Нет загруженных фото" />}
      {!isLoading && !isError && photos.length > 0 && (
        <List
          dataSource={photos}
          renderItem={(p) => (
            <List.Item key={p.id}>
              <List.Item.Meta
                avatar={<img src={(p.dataBase64?.startsWith('data:') ? p.dataBase64 : `data:${p.mimeType || 'image/jpeg'};base64,${p.dataBase64}`)} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />}
                title={<span>Фото {p.id.slice(0, 6)} • {p.isActiveForRating ? <Tag color="green">Активно</Tag> : <Tag>Не активно</Tag>}</span>}
                description={<div>
                  <div>Всего оценок: {p.stats?.overall?.count || 0}</div>
                  <div>Средняя: {typeof p.stats?.overall?.average === 'number' ? p.stats.overall.average.toFixed(2) : '-'}</div>
                </div>}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
