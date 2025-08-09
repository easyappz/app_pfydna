import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Descriptions, Empty, Flex, Row, Space, Spin, Tag, Typography, Rate as AntRate, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNextPhoto, createRating } from '../../api/ratings';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ReloadOutlined, CheckCircleTwoTone } from '@ant-design/icons';

function buildDataUrl(dataBase64, mimeType) {
  if (!dataBase64) return '';
  if (dataBase64.indexOf('data:') === 0) return dataBase64;
  const mt = mimeType || 'image/jpeg';
  return `data:${mt};base64,${dataBase64}`;
}

export default function RatePhotosPage() {
  const { user, setUser } = useAuth();
  const qc = useQueryClient();
  const [value, setValue] = useState(0);

  const filtersText = useMemo(() => {
    const f = user?.filterSettings;
    if (!f) return 'Фильтры: по умолчанию';
    const g = f.gender || 'any';
    const age = f.ageFrom != null || f.ageTo != null ? `${f.ageFrom ?? '—'}–${f.ageTo ?? '—'}` : 'любой возраст';
    const genderMap = { any: 'любой пол', male: 'мужчины', female: 'женщины', other: 'другое' };
    return `Фильтры: ${genderMap[g] || 'любой пол'}, ${age}`;
  }, [user]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['nextPhoto'],
    queryFn: async () => {
      const res = await getNextPhoto(); // сервер возьмёт фильтры из user.filterSettings
      return res;
    },
    retry: false,
  });

  useEffect(() => { setValue(0); }, [data?.photo?.id]);

  const mutation = useMutation({
    mutationFn: async ({ photoId, rating }) => {
      const res = await createRating({ photoId, value: rating });
      return res;
    },
    onSuccess: (res) => {
      const points = res?.balances?.rater;
      if (typeof points === 'number') {
        setUser((prev) => prev ? { ...prev, points } : prev);
      }
      message.success({ content: 'Оценка отправлена! Загружаем следующую фотографию…', icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> });
      qc.invalidateQueries({ queryKey: ['nextPhoto'] });
      refetch();
    },
    onError: (e) => {
      message.error(e?.response?.data?.error || 'Не удалось отправить оценку');
    },
  });

  const onRate = () => {
    if (!data?.photo?.id || value < 1) return;
    mutation.mutate({ photoId: data.photo.id, rating: value });
  };

  const loadingView = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
      <Spin size="large" />
    </div>
  );

  const noPhoto = !isLoading && (isError || !data?.photo);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card title="Оценка фотографий" extra={<Space>
          <Typography.Text type="secondary">{filtersText}</Typography.Text>
          <Link to="/filters">Настройки фильтров</Link>
        </Space>}>
          {(isLoading || isFetching) && loadingView}

          {noPhoto && (
            <div style={{ padding: 16 }}>
              <Empty description={
                <div>
                  <div style={{ marginBottom: 8 }}>Нет доступных фото по вашим текущим фильтрам.</div>
                  <div>Попробуйте изменить фильтры или обновить выдачу.</div>
                </div>
              }>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => refetch()}>Обновить</Button>
                  <Button type="primary"><Link to="/filters">Изменить фильтры</Link></Button>
                </Space>
              </Empty>
              {error?.response?.data?.error && (
                <Alert style={{ marginTop: 16 }} type="info" message={error.response.data.error} />
              )}
            </div>
          )}

          {!isLoading && data?.photo && (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={buildDataUrl(data.photo.dataBase64, data.photo.mimeType)}
                    alt="Для оценки"
                    style={{ maxWidth: '100%', maxHeight: 480, borderRadius: 12, objectFit: 'contain', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                  />
                </div>
              </Col>
              <Col span={24}>
                <Card size="small" title="Информация об авторе">
                  <Descriptions bordered size="small" column={2}>
                    <Descriptions.Item label="Пол">{data.owner?.gender || 'не указан'}</Descriptions.Item>
                    <Descriptions.Item label="Возраст">{data.owner?.age != null ? data.owner.age : 'не указан'}</Descriptions.Item>
                    <Descriptions.Item label="Статус фото" span={2}>
                      {data.photo?.isActiveForRating ? <Tag color="green">в рейтинге</Tag> : <Tag>не активно</Tag>}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Flex align="center" gap={16} style={{ padding: 8, background: '#fafafa', borderRadius: 8 }}>
                  <Typography.Text strong>Ваша оценка:</Typography.Text>
                  <AntRate value={value} onChange={setValue} allowClear={false} />
                  <Button type="primary" onClick={onRate} loading={mutation.isPending} disabled={!value}>Оценить</Button>
                  <Button icon={<ReloadOutlined />} onClick={() => refetch()} disabled={mutation.isPending}>Другое фото</Button>
                  <Tag color="gold">Ваши баллы: {user?.points ?? 0}</Tag>
                </Flex>
              </Col>
            </Row>
          )}
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Подсказки" size="small">
          <Space direction="vertical">
            <Typography.Text>
              • Используйте «Настройки фильтров», чтобы выбирать пол и возраст авторов фотографий.
            </Typography.Text>
            <Typography.Text>
              • Если фотографий нет — измените фильтры или нажмите «Обновить».
            </Typography.Text>
            <Typography.Text>
              • За каждую оценку вы получаете +1 балл, у автора списывается 1 балл.
            </Typography.Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
