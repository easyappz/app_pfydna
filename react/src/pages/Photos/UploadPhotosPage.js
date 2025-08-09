import React, { useState } from 'react';
import { Card, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import photosApi from '../../api/photos';
import getErrorMessage from '../../utils/getErrorMessage';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadPhotosPage() {
  const [loading, setLoading] = useState(false);

  const beforeUpload = async (file) => {
    setLoading(true);
    try {
      const dataUrl = await fileToBase64(file);
      const base64 = typeof dataUrl === 'string' ? dataUrl : '';
      const payload = { dataBase64: base64, mimeType: file.type };
      await photosApi.upload(payload);
      message.success('Фото загружено (не активно для рейтинга)');
    } catch (e) {
      message.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
    return false; // prevent auto upload by antd
  };

  return (
    <Card title="Загрузка фото">
      <Upload.Dragger multiple={false} accept="image/*" beforeUpload={beforeUpload} showUploadList={false} disabled={loading}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Кликните или перетащите изображение для загрузки</p>
        <p className="ant-upload-hint">Изображение будет загружено как base64 (до 1MB)</p>
      </Upload.Dragger>
      <div style={{ marginTop: 16 }}>
        <Button loading={loading} disabled>Загрузка...</Button>
      </div>
    </Card>
  );
}
