import { LinkOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Segmented, Space, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { Timeline } from '@/components/common/Timeline';
import { findRegulationById, getRelatedRegulations, regulationStatusLabels } from './data';
import { useFavoriteRegulations } from './useFavoriteRegulations';

export function RegulationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const regulation = findRegulationById(id);
  const { isFavorite, toggleFavorite } = useFavoriteRegulations();
  const [contentMode, setContentMode] = useState<'origin' | 'translated'>('origin');
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(
    regulation?.articles[0]?.id,
  );

  const selectedArticle = useMemo(
    () =>
      regulation?.articles.find((article) => article.id === selectedArticleId) ??
      regulation?.articles[0],
    [regulation, selectedArticleId],
  );

  if (!regulation) {
    return (
      <EmptyState
        title="未找到法规详情"
        description="当前法规记录不存在，可能已被移除或链接无效。"
        actionLabel="返回法规智库"
        onAction={() => navigate('/regulations')}
      />
    );
  }

  const relatedRegulations = getRelatedRegulations(regulation.relatedIds);

  return (
    <div className="regulations-page">
      {contextHolder}
      <Card className="ui-card regulation-detail-summary" bordered={false}>
        <Space direction="vertical" size={16} className="regulation-detail-stack">
          <Space wrap>
            <Typography.Title level={3} className="regulation-detail-title">
              {regulation.title}
            </Typography.Title>
            <Tag color="blue">{regulation.country}</Tag>
            <Tag>{regulation.level}</Tag>
            <Tag color={regulation.status === 'effective' ? 'success' : 'warning'}>
              {regulationStatusLabels[regulation.status]}
            </Tag>
          </Space>
          <Typography.Paragraph className="regulation-detail-copy">
            {regulation.summary}
          </Typography.Paragraph>
          <Space wrap>
            <Button
              type="primary"
              icon={isFavorite(regulation.id) ? <StarFilled /> : <StarOutlined />}
              onClick={() => toggleFavorite(regulation.id)}
            >
              {isFavorite(regulation.id) ? '取消收藏' : '收藏法规'}
            </Button>
            <Button
              icon={<LinkOutlined />}
              onClick={() => {
                void messageApi.info('已打开法规来源入口');
              }}
            >
              查看法规来源
            </Button>
          </Space>
        </Space>
      </Card>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={7}>
          <Card className="ui-card regulation-outline-card" bordered={false}>
            <Space direction="vertical" size={16} className="regulation-outline-stack">
              <Typography.Title level={5} className="section-title">
                条款目录
              </Typography.Title>
              <List
                dataSource={regulation.articles}
                renderItem={(article) => (
                  <List.Item className="regulation-outline-item">
                    <Button
                      type={selectedArticle?.id === article.id ? 'primary' : 'text'}
                      block
                      onClick={() => setSelectedArticleId(article.id)}
                    >
                      {article.title}
                    </Button>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={17}>
          <Card className="ui-card regulation-content-card" bordered={false}>
            <Space direction="vertical" size={16} className="regulation-content-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  条款正文
                </Typography.Title>
                <Segmented
                  value={contentMode}
                  options={[
                    { label: '原文', value: 'origin' },
                    { label: '中文译文', value: 'translated' },
                  ]}
                  onChange={(value) => setContentMode(value as 'origin' | 'translated')}
                />
              </div>
              <Card className="regulation-article-card">
                <Space direction="vertical" size={12}>
                  <Space wrap>
                    <Typography.Title level={5} className="regulation-article-title">
                      {selectedArticle?.title}
                    </Typography.Title>
                    {selectedArticle?.highlighted ? (
                      <Tag color="gold">重点条款</Tag>
                    ) : null}
                  </Space>
                  <Typography.Paragraph className="regulation-article-copy">
                    {contentMode === 'origin'
                      ? selectedArticle?.content
                      : selectedArticle?.translatedContent}
                  </Typography.Paragraph>
                </Space>
              </Card>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <RegulationCitation
                    title="法规基本信息"
                    citations={[
                      {
                        id: `${regulation.id}-publish`,
                        title: `发布机关：${regulation.authority}`,
                        article: `发布日期：${regulation.publishDate}`,
                        summary: `生效日期：${regulation.effectiveDate ?? '待定'} · 语言：${regulation.language}`,
                      },
                      {
                        id: `${regulation.id}-topics`,
                        title: `主题：${regulation.topics.join(' / ')}`,
                        article: `行业：${regulation.industries.join(' / ')}`,
                        summary: '可用于法规库筛选、法规比较和问答引用。',
                      },
                    ]}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <Timeline
                    title="历史版本"
                    items={[
                      {
                        color: '#18578f',
                        title: '当前展示版本',
                        description: `当前版本发布时间 ${regulation.publishDate}，用于法规内容展示与对照。`,
                      },
                      {
                        color: '#d9d9d9',
                        title: '历史版本占位',
                        description: '后续可扩展法规修订版、草案版与废止版时间线。',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="regulation-list-stack">
          <Typography.Title level={5} className="section-title">
            相关法规
          </Typography.Title>
          <Row gutter={[16, 16]}>
            {relatedRegulations.map((item) => (
              <Col xs={24} md={12} key={item.id}>
                <Card className="regulation-related-card">
                  <Space direction="vertical" size={10}>
                    <Typography.Text strong>{item.title}</Typography.Text>
                    <Typography.Paragraph className="regulation-detail-copy">
                      {item.summary}
                    </Typography.Paragraph>
                    <Button onClick={() => navigate(`/regulations/detail/${item.id}`)}>
                      查看详情
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </Card>
    </div>
  );
}
