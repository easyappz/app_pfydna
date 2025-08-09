import React from 'react';
import { Card, List, Statistic, Typography, Tag, Space, Image } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { myPhotos } from '../../api/photos';

export default function PhotoStatsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['photos', 'my', 'stats'], queryFn: myPhotos });

  return (
    <Card title="Статистика фотографий" loading={isLoading}>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2 }}
        dataSource={data?.photos || []}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card title={<Space><Image src={item.dataBase64} width={64} style={{ objectFit: 'cover' }} /> <span>Фото #{item.id.slice(-5)}</span></Space>}>
              <Space size={24} wrap>
                <Statistic title="Средняя оценка" value={item.stats?.overall?.average ?? 0} precision={2} />
                <Statistic title="Кол-во оценок" value={item.stats?.overall?.count ?? 0} />
                <Tag color={item.isActiveForRating ? 'green' : 'default'}>
                  {item.isActiveForRating ? 'Активно' : 'Неактивно'}
                </Tag>
              </Space>
              <div style={{ marginTop: 12 }}>
                <Typography.Text type="secondary">По полу и возрасту: упрощённый вид</Typography.Text>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
}
