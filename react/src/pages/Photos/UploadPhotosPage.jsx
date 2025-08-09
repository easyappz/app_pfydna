import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, Divider, List, Upload, message, Switch, Image, Space, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPhoto, myPhotos, toggleActive } from '../../api/photos';

const { Dragger } = Upload;

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function UploadPhotosPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['photos', 'my'], queryFn: myPhotos });

  const uploadMutation = useMutation({
    mutationFn: async ({ dataBase64, mimeType }) => uploadPhoto({ dataBase64, mimeType }),
    onSuccess: () => {
      message.success('Фото загружено');
      qc.invalidateQueries({ queryKey: ['photos', 'my'] });
    },
    onError: (e) => message.error(e?.response?.data?.error || 'Ошибка загрузки'),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }) => toggleActive(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['photos', 'my'] }),
    onError: (e) => message.error(e?.response?.data?.error || 'Ошибка изменения статуса'),
  });

  const props = {
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        const dataUrl = await toBase64(file);
        uploadMutation.mutate({ dataBase64: dataUrl, mimeType: file.type });
      } catch (e) {
        message.error('Не удалось прочитать файл');
      }
      return false;
    },
  };

  return (
    <div>
      <Card title="Загрузка фотографий" bordered={false}>
        <Dragger {...props} disabled={uploadMutation.isPending}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Перетащите изображение сюда или кликните для выбора</p>
          <p className="ant-upload-hint">Поддерживаются JPG/PNG, размер до ~1 МБ</p>
        </Dragger>
      </Card>

      <Divider />

      <Card title="Мои фотографии" bordered={false} loading={isLoading}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
          dataSource={data?.photos || []}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card
                cover={<Image src={item.dataBase64} alt="photo" style={{ objectFit: 'cover', height: 240 }} />}
                actions={[
                  <Space key="active" style={{ padding: '0 16px', width: '100%', justifyContent: 'space-between' }}>
                    <Typography.Text>Участвует в оценке</Typography.Text>
                    <Switch
                      checked={item.isActiveForRating}
                      loading={toggleMutation.isPending}
                      onChange={(checked) => toggleMutation.mutate({ id: item.id, active: checked })}
                    />
                  </Space>,
                ]}
              >
                <Card.Meta
                  description={
                    <div>
                      <div>Создано: {new Date(item.createdAt).toLocaleString()}</div>
                      <div>Тип: {item.mimeType || 'неизвестно'}</div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
