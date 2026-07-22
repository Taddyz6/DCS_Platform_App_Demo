import { Button, Card, Checkbox, Col, Row, Select, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResultSummary } from '@/components/common/ResultSummary';
import { LoadingState } from '@/components/common/LoadingState';
import { scenarios } from '@/mock';
import { createAssessmentPayloadFromListPolicy, getScenarioById } from './data';
import { useAssessmentWorkspace } from './useAssessmentWorkspace';

const policyOptions = [
  { label: '负面清单', value: 'negative' },
  { label: '正面清单', value: 'positive' },
  { label: '豁免条件', value: 'exemption' },
  { label: '自贸区便利化政策', value: 'ftz' },
  { label: '绿色通道', value: 'green' },
];

export function AssessmentListPolicyPage() {
  const navigate = useNavigate();
  const { createRecord } = useAssessmentWorkspace();
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([
    'negative',
    'exemption',
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [previewSummary, setPreviewSummary] = useState<{
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
  } | null>(null);

  const scenario = useMemo(() => getScenarioById(scenarioId), [scenarioId]);

  const runAnalysis = () => {
    if (!scenario) {
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const payload = createAssessmentPayloadFromListPolicy({
        scenario,
        selectedPolicies,
      });
      setPreviewSummary({
        riskLevel: payload.riskLevel,
        description: payload.resultSummary,
      });
      const recordId = createRecord(payload);
      setSubmitting(false);
      navigate(`/assessment/result/${recordId}`);
    }, 700);
  };

  if (submitting) {
    return (
      <LoadingState
        title="正在执行清单政策识别"
        description="系统正在扫描负面清单、豁免条件和便利化政策线索。"
      />
    );
  }

  return (
    <div className="assessment-page">
      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={18} className="assessment-list-stack">
          <Typography.Title level={5} className="section-title">
            清单政策识别
          </Typography.Title>
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Typography.Text>业务场景</Typography.Text>
              <Select
                value={scenarioId}
                options={scenarios.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                onChange={setScenarioId}
              />
            </Col>
            <Col xs={24} lg={12}>
              <Typography.Text>需要扫描的政策项</Typography.Text>
              <Checkbox.Group
                className="assessment-checkbox-group"
                value={selectedPolicies}
                options={policyOptions}
                onChange={(value) => setSelectedPolicies(value as string[])}
              />
            </Col>
          </Row>
          <Space wrap>
            <Button type="primary" onClick={runAnalysis}>
              开始识别
            </Button>
            <Button onClick={() => setSelectedPolicies(['negative', 'exemption'])}>
              恢复默认项
            </Button>
          </Space>
        </Space>
      </Card>

      {previewSummary ? (
        <ResultSummary
          title="最近一次识别摘要"
          riskLevel={previewSummary.riskLevel}
          status="completed"
          description={previewSummary.description}
          metrics={[
            { label: '目标国家', value: scenario?.toCountry ?? '-' },
            { label: '扫描项', value: `${selectedPolicies.length} 项` },
            { label: '场景行业', value: scenario?.industry ?? '-' },
            { label: '下一步', value: '查看结果页' },
          ]}
        />
      ) : null}
    </div>
  );
}
