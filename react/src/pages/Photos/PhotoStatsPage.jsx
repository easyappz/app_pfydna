import React from 'react';
import { Card, Typography, Row, Col, Image, Space, Progress, Tag, Divider, Empty } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getMyPhotos } from '../../api/photos';

const { Title, Paragraph, Text } = Typography;

function AverageProgress({ average }) {
  if (average == null) {
    return <Text type="secondary">Нет оценок</Text>;
  }
  const percent = Math.round((Number(average) / 5) * 100);
  return (
    <Progress
      type="dashboard"
      percent={percent}
      size={100}
      format={() => `${Number(average).toFixed(1)}/5`}
    />
  );
}

function GenderBreakdown({ byGender }) {
  const entries = Object.entries(byGender || {});
  if (!entries.length) return <Text type="secondary">Нет данных по полу</Text>;
  const colorMap = { male: 'blue', female: 'magenta', other: 'purple', unknown: 'default' };
  return (
    <Space size={[8, 8]} wrap>
      {entries.map(([gender, data]) => (
        <Tag key={gender} color={colorMap[gender] || 'default'}>
          {gender}: {data.count} • ср. {Number(data.average || 0).toFixed(1)}
        </Tag>
      ))}
    </Space>
  );
}

function AgeBreakdown({ byAgeGroup }) {
  const entries = Object.entries(byAgeGroup || {});
  if (!entries.length) return <Text type="secondary">Нет данных по возрасту</Text>;
  return (
    <Space size={[8, 8]} wrap>
      {entries.map(([group, data]) => (
        <Tag key={group} color="geekblue">
          {group}: {data.count} • ср. {Number(data.average || 0).toFixed(1)}
        </Tag>
      ))}
    </Space>
  );
}

export default function PhotoStatsPage() {
  const { data: photos = [], isLoading } = useQuery({ queryKey: ['myPhotosStats'], queryFn: getMyPhotos });

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Card>
        <Title level={3} style={{ margin: 0 }}>Статистика фотографий</Title>
        <Paragraph type="secondary" style={{ marginTop: 8 }}>
          По каждому фото показаны средняя оценка и разбивка по полу и возрастным группам.
        </Paragraph>
      </Card>

      {isLoading ? (
        <Card><Paragraph>Загрузка...</Paragraph></Card>
      ) : photos.length === 0 ? (
        <Empty description="Нет загруженных фотографий" />
      ) : (
        <Row gutter={[16, 16]}>
          {photos.map((p) => {
            const stats = p.stats || {};
            const overall = stats.overall || { average: null, count: 0 };
            return (
              <Col xs={24} sm={24} md={12} lg={8} key={p.id}>
                <Card
                  hoverable
                  cover={<Image src={p.dataBase64} alt="photo" style={{ objectFit: 'cover', height: 220 }} />}
                  bodyStyle={{ padding: 16 }}
                >
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                      <Text strong>Средняя оценка</Text>
                      <AverageProgress average={overall.average} />
                    </Space>
                    <Text type="secondary">Всего оценок: {overall.count || 0}</Text>
                    <Divider style={{ margin: '8px 0' }} />
                    <Text strong>По полу</Text>
                    <GenderBreakdown byGender={stats.byGender} />
                    <Divider style={{ margin: '8px 0' }} />
                    <Text strong>По возрастным группам</Text>
                    <AgeBreakdown byAgeGroup={stats.byAgeGroup} />
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Space>
  );
}
