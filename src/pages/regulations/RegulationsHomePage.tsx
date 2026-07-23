import { Button, Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { ModuleCard } from '@/components/common/ModuleCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { StatCard } from '@/components/common/StatCard';
import {
  domesticCoreRegulations,
  domesticLatestRegulations,
  domesticPilotListRows,
  domesticRegulationTopics,
  qaSuggestedQuestions,
} from './data';

interface DomesticPilotListRow {
  id: string;
  publishDate: string;
  region: string;
  coverage: string;
  scenarioData: string;
  mechanism: string;
}

export function RegulationsHomePage() {
  const navigate = useNavigate();

  const pilotColumns: ColumnsType<DomesticPilotListRow> = [
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 124,
    },
    {
      title: '自贸区/地区',
      dataIndex: 'region',
      key: 'region',
      width: 110,
    },
    {
      title: '覆盖领域',
      dataIndex: 'coverage',
      key: 'coverage',
      width: 360,
    },
    {
      title: '场景/数据项',
      dataIndex: 'scenarioData',
      key: 'scenarioData',
      width: 260,
    },
    {
      title: '特色机制',
      dataIndex: 'mechanism',
      key: 'mechanism',
      width: 380,
    },
  ];

  return (
    <div className="regulations-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <StatCard
            title="国家层面核心法规"
            value={domesticCoreRegulations.length}
            suffix="项"
            description="聚焦数据出境安全评估、标准合同、便利化规则和汽车专项指引。"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="地方/自贸区清单"
            value={domesticPilotListRows.length}
            suffix="份"
            description="按地方产业特点发布数据出境负面清单，形成便利化试点体系。"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="汽车专项关注"
            value="研发/自动驾驶/OTA"
            description="围绕汽车研发设计、联网运行、驾驶自动化和 OTA 等重点跨境场景。"
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <Card className="ui-card regulation-topic-card" bordered={false} id="national-regulations">
            <Space direction="vertical" size={16} className="regulation-topic-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  国家层面核心法规
                </Typography.Title>
                <Tag className="regulation-topic-tag">国内法规</Tag>
              </div>
              <List
                dataSource={domesticCoreRegulations}
                renderItem={(item) => (
                  <List.Item className="regulation-home-list-item">
                    <List.Item.Meta
                      title={
                        <Space wrap size={[8, 8]}>
                          <Typography.Text strong>{item.title}</Typography.Text>
                          <Tag>{item.level}</Tag>
                          <Tag color="blue">{item.publishDate}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Typography.Text>{item.authority}</Typography.Text>
                          <Typography.Paragraph className="regulation-home-copy">
                            {item.summary}
                          </Typography.Paragraph>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card className="ui-card regulation-topic-card" bordered={false}>
            <Space direction="vertical" size={16} className="regulation-topic-stack">
              <Typography.Title level={5} className="section-title">
                国内智库结构
              </Typography.Title>
              <Space wrap>
                {domesticRegulationTopics.map((topic) => (
                  <Tag key={topic} className="regulation-topic-tag">
                    {topic}
                  </Tag>
                ))}
              </Space>
              <Typography.Paragraph className="regulation-home-copy">
                当前法规智库聚焦中国境内规则体系，分为两层展示：一是国家层面的核心制度与汽车专项要求，
                二是地方及自贸试验区的数据出境负面清单、便利化机制与适用范围。
              </Typography.Paragraph>
              <Typography.Paragraph className="regulation-home-copy">
                其中《汽车数据出境安全指引（2026版）》重点细化研发设计、驾驶自动化、联网运行、OTA
                等场景下重要数据识别的可量化判据，并明确跨境管理、防护技术、日志记录和应急处置等要求。
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <ModuleCard
            title="国家层面法规"
            description="聚焦国家法律、部门规章和汽车专项指引，梳理核心出境制度与适用边界。"
            icon={<span className="feature-dot" />}
            meta="法律 / 部门规章 / 专项指引"
            actionLabel="查看国家层面"
            onAction={() => {
              document.getElementById('national-regulations')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          />
        </Col>
        <Col xs={24} xl={8}>
          <ModuleCard
            title="地方负面清单"
            description="围绕各地汽车产业与自贸区试点，展示研发、制造、车联网和软件升级相关的数据出境负面清单。"
            icon={<span className="feature-dot" />}
            meta="地方层面 / 自贸区 / 便利化"
            actionLabel="查看地方清单"
            onAction={() => {
              document.getElementById('pilot-list-table')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          />
        </Col>
        <Col xs={24} xl={8}>
          <ModuleCard
            title="智能法规问答"
            description="围绕国内法规与汽车数据跨境场景给出预置问答和条款引用。"
            icon={<span className="feature-dot" />}
            meta="法规问答 / 条款引用"
            actionLabel="开始问答"
            onAction={() => navigate('/regulations/qa')}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="regulation-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  最新更新法规
                </Typography.Title>
                <Button type="link" onClick={() => navigate('/regulations')}>
                  国内法规总览
                </Button>
              </div>
              <List
                dataSource={domesticLatestRegulations.slice(0, 6)}
                renderItem={(item) => (
                  <List.Item
                    className="regulation-home-list-item"
                    actions={[
                      <Button
                        key="detail"
                        type="link"
                        onClick={() => navigate(`/regulations/detail/${item.id}`)}
                      >
                        详情
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={`${item.authority} · ${item.level} · ${item.publishDate}`}
                    />
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <RegulationCitation
            title="推荐问题"
            citations={qaSuggestedQuestions.map((question, index) => ({
              id: `question-${index + 1}`,
              title: question,
              article: `推荐问题 ${index + 1}`,
              summary: '点击进入智能法规问答页，可基于国内法规和汽车数据场景返回预置答案。',
            }))}
          />
        </Col>
      </Row>

      <Card className="ui-card" bordered={false} id="pilot-list-table">
        <Space direction="vertical" size={16} className="regulation-list-stack">
          <Typography.Title level={5} className="section-title">
            地方与自贸区数据出境负面清单
          </Typography.Title>
          <Typography.Paragraph className="regulation-home-copy">
            该部分用于展示地方层面已发布的数据出境负面清单、适用领域、典型业务场景和便利化机制，
            便于后续在合规研判中识别是否存在可适用的地方清单路径。
          </Typography.Paragraph>
          <DataTable
            columns={pilotColumns}
            dataSource={domesticPilotListRows}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 1400 }}
          />
        </Space>
      </Card>
    </div>
  );
}
