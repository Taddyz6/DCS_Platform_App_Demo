import { Card, Col, Form, Input, Radio, Row, Select, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepForm } from '@/components/forms/StepForm';
import { LoadingState } from '@/components/common/LoadingState';
import { scenarios } from '@/mock';
import { createAssessmentPayloadFromPath, getScenarioById } from './data';
import { useAssessmentWorkspace } from './useAssessmentWorkspace';

const dataCategoryOptions = [
  { label: '一般数据', value: 'general' },
  { label: '重要数据', value: 'important' },
  { label: '核心数据', value: 'core' },
  { label: '个人信息', value: 'personal' },
  { label: '敏感个人信息', value: 'sensitive-personal' },
];

const dataScaleOptions = [
  { label: '不涉及个人信息数量统计', value: 'not-applicable' },
  { label: '个人信息不满 10 万人', value: 'personal-under-100k' },
  { label: '个人信息 10 万人以上、不满 100 万人', value: 'personal-100k-to-1m' },
  { label: '个人信息 100 万人以上', value: 'personal-1m-plus' },
  { label: '敏感个人信息不满 1 万人', value: 'sensitive-under-10k' },
  { label: '敏感个人信息 1 万人以上', value: 'sensitive-10k-plus' },
];

export function AssessmentPathPage() {
  const navigate = useNavigate();
  const { createRecord } = useAssessmentWorkspace();
  const [currentStep, setCurrentStep] = useState(0);
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id);
  const [destinationPurpose, setDestinationPurpose] = useState('境外研发协同与车辆数据分析');
  const [dataCategories, setDataCategories] = useState<string[]>(['important']);
  const [dataScaleCategory, setDataScaleCategory] = useState('not-applicable');
  const [isCii, setIsCii] = useState('no');
  const [submitting, setSubmitting] = useState(false);

  const triggersSecurityAssessment =
    dataCategories.includes('important') ||
    dataCategories.includes('core') ||
    dataScaleCategory === 'personal-1m-plus' ||
    dataScaleCategory === 'sensitive-10k-plus' ||
    isCii === 'yes';

  const submit = () => {
    const scenario = getScenarioById(scenarioId);

    if (!scenario || dataCategories.length === 0) {
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const payload = createAssessmentPayloadFromPath({
        scenario,
        destinationPurpose,
        dataCategories,
        dataScaleCategory,
        isCii,
      });
      const recordId = createRecord(payload);
      setSubmitting(false);
      navigate(`/assessment/result/${recordId}`);
    }, 700);
  };

  if (submitting) {
    return (
      <LoadingState
        title="正在生成跨境合规研判结果"
        description="系统正在根据汽车业务场景、数据类别和数量门槛生成推荐路径。"
      />
    );
  }

  return (
    <div className="assessment-page">
      <StepForm
        title="跨境合规研判"
        currentStep={currentStep}
        steps={[
          { key: 'scenario', title: '场景预检', description: '确认汽车业务与出境目的' },
          { key: 'classification', title: '分类与门槛', description: '识别数据类别和数量区间' },
          { key: 'confirm', title: '路径确认', description: '输出安全评估或合同路径' },
        ]}
        content={
          currentStep === 0 ? (
            <Card className="step-form-inner-card">
              <Form layout="vertical">
                <Row gutter={[20, 12]}>
                  <Col span={24}>
                    <Form.Item label="选择汽车业务场景" required>
                      <Select
                        value={scenarioId}
                        options={scenarios.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        onChange={setScenarioId}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="出境目的说明" required>
                      <Input.TextArea
                        rows={4}
                        value={destinationPurpose}
                        placeholder="例如：用于整车研发协同、道路测试分析、驾驶自动化模型优化或 OTA 运维。"
                        onChange={(event) => setDestinationPurpose(event.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Typography.Paragraph className="step-form-inner-copy">
                  预检范围聚焦汽车研发设计、道路测试、驾驶自动化、联网运行和 OTA 场景。
                </Typography.Paragraph>
              </Form>
            </Card>
          ) : currentStep === 1 ? (
            <Card className="step-form-inner-card">
              <Form layout="vertical">
                <Row gutter={[20, 12]}>
                  <Col xs={24} lg={12}>
                    <Form.Item label="拟出境数据类别" required>
                      <Select
                        mode="multiple"
                        value={dataCategories}
                        options={dataCategoryOptions}
                        placeholder="可多选"
                        onChange={setDataCategories}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label="拟出境数据量级类别" required>
                      <Select
                        value={dataScaleCategory}
                        options={dataScaleOptions}
                        onChange={setDataScaleCategory}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="是否为关键信息基础设施运营者" required>
                      <Radio.Group value={isCii} onChange={(event) => setIsCii(event.target.value)}>
                        <Space wrap>
                          <Radio value="yes">是</Radio>
                          <Radio value="no">否</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Card className="assessment-hint-card">
                  <Typography.Paragraph className="assessment-copy">
                    重要数据、核心数据，个人信息达到 100 万人以上，敏感个人信息达到 1 万人以上，
                    或关键信息基础设施运营者向境外提供个人信息时，研判结果将进入安全评估路径。
                  </Typography.Paragraph>
                </Card>
              </Form>
            </Card>
          ) : (
            <Card className="step-form-inner-card">
              <Space direction="vertical" size={14}>
                <Typography.Title level={5} className="section-title">
                  研判条件确认
                </Typography.Title>
                <Space wrap>
                  {dataCategories.map((category) => (
                    <Tag color="blue" key={category}>
                      {dataCategoryOptions.find((item) => item.value === category)?.label}
                    </Tag>
                  ))}
                  <Tag>{dataScaleOptions.find((item) => item.value === dataScaleCategory)?.label}</Tag>
                </Space>
                <Typography.Paragraph className="step-form-inner-copy">
                  {triggersSecurityAssessment
                    ? '当前条件已触发安全评估路径。系统将输出命中条件、法规依据和材料准备建议。'
                    : '当前条件未触发安全评估数量门槛。系统将继续判断标准合同、个人信息保护认证或豁免条件。'}
                </Typography.Paragraph>
              </Space>
            </Card>
          )
        }
        onPrev={() => setCurrentStep((value) => Math.max(0, value - 1))}
        onNext={() => setCurrentStep((value) => Math.min(2, value + 1))}
        onSubmit={submit}
      />
    </div>
  );
}
