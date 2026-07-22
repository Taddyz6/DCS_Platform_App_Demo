import {
  FileProtectOutlined,
  FileSearchOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, List, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ActivityLog } from '@/components/common/ActivityLog';
import { ModuleCard } from '@/components/common/ModuleCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { RiskLevelTag } from '@/components/common/RiskLevelTag';
import { StatCard } from '@/components/common/StatCard';
import {
  getFilingCitations,
  getFilingHomeReports,
  getFilingOverview,
  getLatestCheckResults,
  getFilingTypeLabel,
} from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

export function FilingHomePage() {
  const navigate = useNavigate();
  const { records, materials, localMaterials, checks } = useFilingWorkspace();
  const overview = getFilingOverview(records, localMaterials);
  const latestChecks = getLatestCheckResults(checks);
  const latestMaterials = materials.slice(0, 4);
  const latestRecords = records.slice(0, 5);
  const homeReports = getFilingHomeReports();

  return (
    <div className="filing-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="办理记录"
            value={overview.totalRecords}
            suffix="项"
            description="覆盖安全评估、标准合同和个人信息保护认证。"
            icon={<FileProtectOutlined />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="材料总数"
            value={overview.totalMaterials}
            suffix="份"
            description="材料中心支持编辑、上传元数据和预览。"
            icon={<FileSearchOutlined />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="待复核事项"
            value={overview.reviewCount}
            suffix="项"
            description="建议优先补齐字段清单、联系人和保护措施说明。"
            icon={<ScheduleOutlined />}
          />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <StatCard
            title="已完成事项"
            value={overview.completedCount}
            suffix="项"
            description="已完成事项仍可进入材料中心继续调整说明。"
            icon={<SafetyCertificateOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <ModuleCard
            title="安全评估申报"
            description="适用于高风险、重要数据或特定规模场景，输出申报材料包和补件建议。"
            icon={<span className="feature-dot" />}
            meta="流程入口 + 材料落库"
            actionLabel="开始申报"
            onAction={() => navigate('/filing/security-assessment')}
          />
        </Col>
        <Col xs={24} xl={8}>
          <ModuleCard
            title="标准合同备案"
            description="围绕个人信息出境场景生成备案材料、合同附件和字段清单预览。"
            icon={<span className="feature-dot" />}
            meta="备案入口 + 材料编辑"
            actionLabel="开始备案"
            onAction={() => navigate('/filing/standard-contract')}
          />
        </Col>
        <Col xs={24} xl={8}>
          <ModuleCard
            title="个人信息保护认证"
            description="根据治理成熟度和审计准备度输出认证准备材料与补充建议。"
            icon={<span className="feature-dot" />}
            meta="认证入口 + 自测建议"
            actionLabel="开始准备"
            onAction={() => navigate('/filing/certification')}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="filing-list-stack">
              <div className="regulation-section-head">
                <Typography.Title level={5} className="section-title">
                  最新材料
                </Typography.Title>
                <Button type="link" onClick={() => navigate('/filing/materials')}>
                  查看全部
                </Button>
              </div>
              <List
                dataSource={latestMaterials}
                renderItem={(material) => (
                  <List.Item
                    className="filing-list-item"
                    actions={[
                      <Button
                        key="detail"
                        type="link"
                        onClick={() => navigate(`/filing/materials/${material.id}`)}
                      >
                        编辑
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={material.name}
                      description={`${getFilingTypeLabel(material.filingType)} · 完成度 ${material.completeness}%`}
                    />
                    <RiskLevelTag
                      level={
                        material.completeness >= 90
                          ? 'low'
                          : material.completeness >= 76
                            ? 'medium'
                            : 'high'
                      }
                    />
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <ActivityLog
            title="最近办理动作"
            entries={latestRecords.map((record) => ({
              id: record.id,
              title: record.name,
              time: record.updatedAt,
              operator: getFilingTypeLabel(record.filingType),
              status: record.status,
            }))}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="filing-list-stack">
              <Typography.Title level={5} className="section-title">
                最近检查结果
              </Typography.Title>
              <List
                dataSource={latestChecks}
                renderItem={(result) => (
                  <List.Item className="filing-list-item">
                    <List.Item.Meta
                      title={result.checkType}
                      description={`${result.issues[0] ?? '当前无明显问题'} · 得分 ${result.score}`}
                    />
                    <Button type="link" onClick={() => navigate('/filing/material-check')}>
                      查看检查
                    </Button>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <RegulationCitation
            title="申报备案法规依据"
            citations={getFilingCitations([
              'reg-cn-security-assessment',
              'reg-cn-standard-contract',
              'reg-cn-pipl',
            ])}
          />
        </Col>
      </Row>

      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="filing-list-stack">
          <Typography.Title level={5} className="section-title">
            相关报告入口
          </Typography.Title>
          <List
            dataSource={homeReports}
            renderItem={(report) => (
              <List.Item className="filing-list-item">
                <List.Item.Meta
                  title={report.name}
                  description={`${report.type} · ${report.createdAt.slice(0, 10)}`}
                />
              </List.Item>
            )}
          />
        </Space>
      </Card>
    </div>
  );
}
