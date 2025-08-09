import React from 'react';
import { Empty, Typography, Card } from 'antd';

const PhotoStatsPage = () => {
  return (
    <Card>
      <Typography.Title level={4}>Статистика</Typography.Title>
      <Typography.Paragraph>
        Здесь будут собраны метрики по вашим фотографиям и оценкам.
      </Typography.Paragraph>
      <Empty description="Функциональность в разработке" />
    </Card>
  );
};

export default PhotoStatsPage;
