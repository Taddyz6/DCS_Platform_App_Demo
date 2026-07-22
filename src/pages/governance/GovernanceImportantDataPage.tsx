import { DatabaseOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Select, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ResultSummary } from '@/components/common/ResultSummary';
import { Timeline } from '@/components/common/Timeline';
import {
  getAssetById,
  getAssetFieldList,
  getGovernanceCitations,
  governanceAssetOptions,
} from './data';

const getRecognitionView = (assetId?: string) => {
  const asset = getAssetById(assetId) ?? getAssetById(governanceAssetOptions[0]?.value);

  if (!asset) {
    return undefined;
  }

  const isLevelOne = asset.level === '一级';
  const isHighConcern = asset.riskLevel === 'high';
  const likelihood = isLevelOne || isHighConcern ? '高' : asset.level === '二级' ? '中' : '低';
  const impact = isLevelOne ? '严重' : isHighConcern ? '高' : asset.level === '二级' ? '高' : '中';
  const matrixLevel = isLevelOne ? '严重' : isHighConcern ? '高' : asset.level === '二级' ? '中' : '低';
  const score = isLevelOne ? 94 : isHighConcern ? 84 : asset.level === '二级' ? 66 : 36;
  const outcome = asset.suspectedImportantData
    ? '疑似重要数据'
    : asset.sensitivePersonalInfo
      ? '敏感个人信息'
      : asset.personalInfo
        ? '个人信息'
        : '一般汽车数据';
  const recommendedAction = asset.suspectedImportantData
    ? '进入汽车重要数据人工复核，并衔接数据出境安全评估准备。'
    : asset.sensitivePersonalInfo
      ? '核查敏感个人信息数量门槛及标准合同、认证或安全评估路径。'
      : '保留分类分级依据，业务场景或数据规模变化时重新识别。';

  return {
    asset,
    likelihood,
    impact,
    matrixLevel,
    score,
    outcome,
    recommendedAction,
    riskLevel: asset.riskLevel,
    hitRules: [
      `汽车数据场景：${asset.purpose}`,
      `分类分级基线：${asset.level} / ${asset.category}`,
      asset.suspectedImportantData
        ? '汽车数据台账已标记疑似重要数据属性'
        : asset.sensitivePersonalInfo
          ? '涉及敏感个人信息处理活动'
          : asset.personalInfo
            ? '涉及个人信息处理活动'
            : '未识别个人信息属性',
      `GB/T 39335-2020 风险矩阵：可能性${likelihood} × 影响程度${impact} = ${matrixLevel}风险`,
    ],
  };
};

export function GovernanceImportantDataPage() {
  const navigate = useNavigate();
  const [selectedAssetId, setSelectedAssetId] = useState(governanceAssetOptions[0]?.value);
  const view = getRecognitionView(selectedAssetId);

  if (!view) {
    return null;
  }

  const { asset } = view;

  return (
    <div className="governance-page">
      <Card className="ui-card governance-recognition-selector" bordered={false}>
        <div className="governance-recognition-selector-grid">
          <div>
            <Typography.Text className="governance-baseline-kicker">
              AUTOMOTIVE DATA RECOGNITION
            </Typography.Text>
            <Typography.Title level={4} className="governance-recognition-title">
              汽车重要数据识别展示
            </Typography.Title>
            <Typography.Paragraph className="governance-copy">
              选择汽车数据资产，系统将依据分类分级基线、汽车行业规则和 GB/T 39335-2020 风险矩阵直接展示识别结论。
            </Typography.Paragraph>
          </div>
          <div className="governance-recognition-select-block">
            <Typography.Text>查看汽车数据资产</Typography.Text>
            <Select
              value={selectedAssetId}
              options={governanceAssetOptions}
              onChange={setSelectedAssetId}
            />
          </div>
        </div>

        <Card className="governance-classification-baseline" bordered={false}>
          <div className="governance-classification-baseline-head">
            <div>
              <Typography.Text className="governance-baseline-kicker">
                CLASSIFICATION BASELINE
              </Typography.Text>
              <Typography.Title level={5} className="section-title">
                分类分级基线
              </Typography.Title>
            </div>
            <Tag color={asset.level === '一级' ? 'red' : asset.level === '二级' ? 'orange' : 'green'}>
              {asset.level}
            </Tag>
          </div>
          <div className="governance-baseline-grid">
            <div>
              <span>汽车数据类别</span>
              <strong>{asset.category}</strong>
            </div>
            <div>
              <span>处理场景</span>
              <strong>{asset.purpose}</strong>
            </div>
            <div>
              <span>数据属性</span>
              <strong>{view.outcome}</strong>
            </div>
            <div>
              <span>初始关注等级</span>
              <strong>{asset.riskLevel === 'high' ? '高' : asset.riskLevel === 'medium' ? '中' : '低'}</strong>
            </div>
          </div>
        </Card>
      </Card>

      <ResultSummary
        title={`${asset.name}识别结论`}
        riskLevel={view.riskLevel}
        status="completed"
        description={view.recommendedAction}
        metrics={[
          { label: '识别结论', value: view.outcome },
          { label: '综合分值', value: String(view.score) },
          { label: '发生可能性', value: view.likelihood },
          { label: '矩阵风险等级', value: view.matrixLevel },
        ]}
      />

      <Row gutter={[20, 20]} align="stretch">
        <Col xs={24} xl={12}>
          <Timeline
            title="规则识别路径"
            items={view.hitRules.map((item, index) => ({
              color: index === view.hitRules.length - 1 ? '#2f7d4b' : '#18578f',
              title: item,
              description:
                index === view.hitRules.length - 1
                  ? '综合分类分级、数据属性和标准矩阵形成当前结论。'
                  : '该项作为识别依据写入规则路径。',
            }))}
          />
        </Col>
        <Col xs={24} xl={12}>
          <Card className="ui-card governance-recognition-detail-card" bordered={false}>
            <Space direction="vertical" size={18} className="governance-list-stack">
              <div className="assessment-result-section-head">
                <div className="assessment-result-section-icon assessment-result-section-icon-blue">
                  <DatabaseOutlined />
                </div>
                <div>
                  <Typography.Title level={5} className="section-title">
                    数据字段与处理边界
                  </Typography.Title>
                  <Typography.Text>来源于汽车数据分类分级台账</Typography.Text>
                </div>
              </div>
              <Space wrap>
                {getAssetFieldList(asset).map((field) => (
                  <Tag color="blue" key={field}>{field}</Tag>
                ))}
              </Space>
              <div className="governance-recognition-facts">
                <div><span>源系统</span><strong>{asset.system}</strong></div>
                <div><span>目标节点</span><strong>{asset.destination}</strong></div>
                <div><span>数据主体</span><strong>{asset.subjectType}</strong></div>
                <div><span>留存周期</span><strong>{asset.retentionPeriod}</strong></div>
              </div>
              <Card className="governance-hint-card">
                <Space align="start">
                  <SafetyCertificateOutlined />
                  <Typography.Paragraph className="governance-copy">
                    {view.recommendedAction}
                  </Typography.Paragraph>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>

      <RegulationCitation
        title="识别规则来源 · 国内法规智库"
        citations={getGovernanceCitations([
          'reg-cn-auto-guide-2026',
          'reg-cn-gbt39335',
          'reg-cn-dsl',
          'reg-cn-security-assessment',
          'reg-cn-data-flow',
        ])}
        onCitationClick={(citation) => navigate(`/regulations/detail/${citation.id}`)}
      />

      <div className="governance-recognition-footer-action">
        <Button onClick={() => navigate('/governance/classification')}>查看分类分级</Button>
        <Button type="primary" onClick={() => navigate('/regulations')}>查看国内法规智库</Button>
      </div>
    </div>
  );
}
