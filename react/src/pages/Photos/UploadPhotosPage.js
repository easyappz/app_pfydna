import React, { useState } from 'react';
import { Button, Card, Space, Typography, Upload, message } from 'antd';
import { uploadPhoto } from '../../api/photos';

export default function UploadPhotosPage() {
  const [loading, setLoading] = useState(false);

  const beforeUpload = () => false; // prevent auto upload

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const onChange = async ({ file }) => {
    if (!file) return;
    try {
      setLoading(true);
      const dataUrl = await toBase64(file);
      const mimeType = file.type || 'image/jpeg';
      const res = await uploadPhoto({ dataBase64: dataUrl, mimeType });
      if (res?.photo) {
        message.success('Фото загружено! Активируйте его для участия в рейтинге в разделе Статистика.');
      } else {
        message.info('Загрузка завершена');
      }
    } catch (e) {
      message.error(e?.response?.data?.error || 'Не удалось загрузить фото');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Загрузка фото">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Text>
          Загрузите фото (до 1 МБ). После загрузки активируйте фото для участия в рейтинге.
        </Typography.Text>
        <Upload accept="image/*" maxCount={1} beforeUpload={beforeUpload} showUploadList={false} customRequest={() => {}} onChange={onChange}>
          <Button loading={loading} type="primary">Выбрать фото</Button>
        </Upload>
      </Space>
    </Card>
  );
}
