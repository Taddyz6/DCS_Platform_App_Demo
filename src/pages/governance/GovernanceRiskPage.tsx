import { Card, Form, Select, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { ChartCard } from '@/components/charts/ChartCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ResultSummary } from '@/components/common/ResultSummary';
import { Questionnaire } from '@/components/forms/Questionnaire';
import { StepForm } from '@/components/forms/StepForm';
import {
  createRiskPayload,
  getAssetById,
  getGovernanceCitations,
  governanceAssetOptions,
  riskQuestions,
} from './data';
import { useGovernanceWorkspace } from './useGovernanceWorkspace';

export function GovernanceRiskPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [assetId, setAssetId] = useState(governanceAssetOptions[0]?.value);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>();
  const { createRecord, getDetailById, getRecordById, records } = useGovernanceWorkspace();
  const [messageApi, contextHolder] = message.useMessage();

  const latestRecord = useMemo(
    () => records.find((record) => record.type === 'risk'),
    [records],
  );
  const activeRecord = getRecordById(selectedRecordId) ?? latestRecord;
  const activeDetail = getDetailById(selectedRecordId) ?? (latestRecord ? getDetailById(latestRecord.id) : undefined);

  const chartOption = useMemo<EChartsOption>(() => {
    if (!activeDetail) {
      return {
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [],
      };
    }

    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: activeDetail.scoreBreakdown.map((item) => item.label),
        axisLabel: { interval: 0, rotate: 12 },
      },
      yAxis: { type: 'value', max: 100 },
      grid: { left: 32, right: 20, top: 28, bottom: 40 },
      color: ['#c9791f'],
      series: [
        {
          type: 'bar',
          barWidth: 26,
          data: activeDetail.scoreBreakdown.map((item) => item.score),
        },
      ],
    };
  }, [activeDetail]);

  const submit = () => {
    const asset = getAssetById(assetId);

    if (!asset) {
      return;
    }

    const payload = createRiskPayload({
      asset,
      answers,
    });
    const recordId = createRecord(payload);
    setSelectedRecordId(recordId);
    setCurrentStep(2);
    void messageApi.success('风险评估结果已生成并写入平台工作区');
  };

  return (
    <div className="governance-page">
      {contextHolder}
      <StepForm
        title="风险评估"
        currentStep={currentStep}
        steps={[
          { key: 'asset', title: '资产选择', description: '确定评估对象' },
          { key: 'questionnaire', title: '风险问卷', description: '评估控制成熟度' },
          { key: 'result', title: '结果输出', description: '形成风险结论' },
        ]}
        content={
          currentStep === 0 ? (
            <Card className="step-form-inner-card">
              <Form layout="vertical">
                <Form.Item label="选择资产">
                  <Select
                    value={assetId}
                    options={governanceAssetOptions}
                    onChange={setAssetId}
                  />
                </Form.Item>
                <Typography.Paragraph className="step-form-inner-copy">
                  建议优先评估高风险、疑似重要数据或跨境接收方复杂的资产。
                </Typography.Paragraph>
              </Form>
            </Card>
          ) : currentStep === 1 ? (
            <Questionnaire
              title="风险评估问卷"
              questions={riskQuestions}
              values={answers}
              onChange={(id, value) =>
                setAnswers((current) => ({ ...current, [id]: value }))
              }
            />
          ) : (
            <Card className="step-form-inner-card">
              <Typography.Paragraph className="step-form-inner-copy">
                系统将根据接收方范围、访问控制和监测审计成熟度生成风险评分与整改建议。
              </Typography.Paragraph>
            </Card>
          )
        }
        onPrev={() => setCurrentStep((value) => Math.max(0, value - 1))}
        onNext={() => setCurrentStep((value) => Math.min(2, value + 1))}
        onSubmit={submit}
      />

      {activeRecord && activeDetail ? (
        <>
          <ResultSummary
            title={`${activeRecord.name}结果`}
            riskLevel={activeRecord.riskLevel}
            status="completed"
            description={activeRecord.summary}
            metrics={[
              { label: '综合分值', value: String(activeRecord.score) },
              { label: '结论标签', value: activeDetail.outcomeLabel },
              { label: '建议动作', value: activeDetail.recommendedAction },
              { label: '更新时间', value: activeRecord.updatedAt.slice(0, 16) },
            ]}
          />

          <ChartCard
            title="风险评分分解"
            subtitle="分值越高表示该维度越需要优先整改"
            option={chartOption}
            height={280}
          />

          <RegulationCitation
            title="法规依据"
            citations={getGovernanceCitations(activeRecord.citations)}
          />
        </>
      ) : null}
    </div>
  );
}
