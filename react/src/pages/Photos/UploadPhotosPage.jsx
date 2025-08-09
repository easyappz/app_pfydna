import React, { useCallback } from 'react';
import { Upload, Typography, message, Card, Row, Col, Image, Space, Switch, Tooltip, Divider, Empty, Tag } from 'antd';
import { CloudUploadOutlined, CheckCircleTwoTone, StopTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadPhoto, getMyPhotos, togglePhotoActive } from '../../api/photos';
import { getMe } from '../../api/users';

const { Dragger } = Upload;
const { Title, Paragraph, Text } = Typography;

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function bytesToSizeString(bytes) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
}

function getMimeFromDataUrl(dataUrl) {
  try {
    const match = dataUrl.split(';')[0].split(':')[1];
    return match || 'image/jpeg';
  } catch (e) {
    return 'image/jpeg';
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadPhotosPage() {
  const queryClient = useQueryClient();

  const { data: me } = useQuery({ queryKey: ['me'], queryFn: getMe });
  const { data: photos = [], isLoading: photosLoading } = useQuery({ queryKey: ['myPhotos'], queryFn: getMyPhotos });

  const uploadMutation = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      message.success('Фото успешно загружено');
      queryClient.invalidateQueries({ queryKey: ['myPhotos'] });
    },
    onError: (err) => {
      const errMsg = err?.response?.data?.error || 'Не удалось загрузить фото';
      message.error(errMsg);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: togglePhotoActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPhotos'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (err) => {
      const errMsg = err?.response?.data?.error || 'Не удалось изменить статус участия';
      message.error(errMsg);
    },
  });

  const handleBeforeUpload = useCallback(async (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error('Поддерживаются только изображения JPG/PNG/WebP');
      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      message.error(`Размер файла ${bytesToSizeString(file.size)} превышает лимит 1 МБ`);
      return Upload.LIST_IGNORE;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const mimeType = getMimeFromDataUrl(dataUrl) || file.type;
      await uploadMutation.mutateAsync({ dataBase64: dataUrl, mimeType });
    } catch (e) {
      message.error('Ошибка при чтении файла');
    }

    // Предотвращаем стандартную отправку Upload
    return Upload.LIST_IGNORE;
  }, [uploadMutation]);

  const handleToggle = (photo, nextActive) => {
    if (nextActive && (me?.points === 0)) {
      message.warning('У вас 0 очков. Активируйте фото возможно только при наличии хотя бы 1 очка.');
      return;
    }
    toggleMutation.mutate({ photoId: photo.id, active: nextActive });
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Title level={3} style={{ margin: 0 }}>Загрузка фотографий</Title>
          <Paragraph type="secondary" style={{ marginBottom: 8 }}>
            Лимит размера: до 1 МБ. Форматы: JPG, PNG, WebP. Фото по умолчанию не участвует в рейтинге до активации.
          </Paragraph>
          <Dragger
            name="file"
            multiple
            accept={ALLOWED_TYPES.join(',')}
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            disabled={uploadMutation.isPending}
            style={{ padding: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ color: '#1677ff' }} />
            </p>
            <p className="ant-upload-text">Перетащите файл сюда или нажмите для выбора</p>
            <p className="ant-upload-hint">Максимум 1 МБ на файл</p>
          </Dragger>
          <Text type="secondary">
            Подсказка: 1 МБ в двоичном виде ≈ 1.33 МБ в Base64. На сервере тоже проверяется лимит.
          </Text>
        </Space>
      </Card>

      <Card title="Мои фото">
        {photosLoading ? (
          <Paragraph>Загрузка...</Paragraph>
        ) : photos.length === 0 ? (
          <Empty description="Вы еще не загрузили ни одного фото" />
        ) : (
          <Row gutter={[16, 16]}>
            {photos.map((p) => {
              const active = !!p.isActiveForRating;
              const canEnable = me?.points > 0;
              const tooltipTitle = active
                ? 'Фото участвует в рейтинге. Вы можете отключить участие в любой момент.'
                : canEnable
                  ? 'Включить участие фото в рейтинге'
                  : 'Недостаточно очков: необходимо минимум 1 очко';

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                  <Card
                    hoverable
                    cover={<Image src={p.dataBase64} alt="photo" style={{ objectFit: 'cover', height: 220 }} />}
                    bodyStyle={{ padding: 12 }}
                  >
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Space>
                          {active ? (
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                          ) : (
                            <StopTwoTone twoToneColor="#faad14" />
                          )}
                          <Text strong>{active ? 'Участвует' : 'Не участвует'}</Text>
                        </Space>
                        <Tooltip title={tooltipTitle}>
                          <Switch
                            checked={active}
                            loading={toggleMutation.isPending}
                            onChange={(checked) => handleToggle(p, checked)}
                            disabled={!active && !canEnable}
                          />
                        </Tooltip>
                      </Space>
                      <Divider style={{ margin: '8px 0' }} />
                      <Space size={[6, 6]} wrap>
                        {active ? <Tag color="green">Активно</Tag> : <Tag>Отключено</Tag>}
                        {p.mimeType ? <Tag color="blue">{p.mimeType}</Tag> : null}
                        <Tag color="default">Оценок: {p?.stats?.overall?.count || 0}</Tag>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>

      <Card type="inner">
        <Space>
          <InfoCircleOutlined />
          <Text type="secondary">
            Чтобы фото получало оценки, включите участие. При включении у вас должно быть как минимум 1 очко.
          </Text>
        </Space>
      </Card>
    </Space>
  );
}
