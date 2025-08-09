import React from 'react';
import { Empty, Typography, Card } from 'antd';

const RatePhotosPage = () => {
  return (
    <Card>
      <Typography.Title level={4}>Оценка</Typography.Title>
      <Typography.Paragraph>
        Здесь будет показана следующая фотография для оценки, согласно вашим фильтрам.
      </Typography.Paragraph>
      <Empty description="Функциональность в разработке" />
    </Card>
  );
};

export default RatePhotosPage;
