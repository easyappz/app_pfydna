import React from 'react';
import { Empty, Typography, Card } from 'antd';

const UploadPhotosPage = () => {
  return (
    <Card>
      <Typography.Title level={4}>Загрузка фото</Typography.Title>
      <Typography.Paragraph>
        Здесь будет интерфейс загрузки фотографий. Вы сможете загрузить изображение и включить участие в рейтинге.
      </Typography.Paragraph>
      <Empty description="Функциональность в разработке" />
    </Card>
  );
};

export default UploadPhotosPage;
