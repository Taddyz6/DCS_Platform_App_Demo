import { Button, Card, Col, Form, Row, Select, Space, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { ChartCard } from '@/components/charts/ChartCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { ResultSummary } from '@/components/common/ResultSummary';
import { getFilingCitations, getFilingTypeLabel } from './data';
import { useFilingWorkspace } from './useFilingWorkspace';

interface MaterialCheckValues {
  materialId: string;
}

export function FilingMaterialCheckPage() {
  const { materials, getMaterialById, getDetailById, runMaterialCheck, checks } = useFilingWorkspace();
  const [form] = Form.useForm<MaterialCheckValues>();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | undefined>();
  const [messageApi, contextHolder] = message.useMessage();

  const latestCheck = useMemo(
    () =>
      selectedMaterialId
        ? checks.find((item) => item.materialId === selectedMaterialId)
        : checks[0],
    [checks, selectedMaterialId],
  );

  const activeMaterialId = selectedMaterialId ?? latestCheck?.materialId ?? materials[0]?.id;
  const activeMaterial = getMaterialById(activeMaterialId);
  const activeDetail = getDetailById(activeMaterialId);
  const activeCheck =
    checks.find((item) => item.materialId === activeMaterialId) ?? latestCheck;

  const chartOption = useMemo<EChartsOption>(() => {
    if (!activeMaterial || !activeCheck) {
      return { xAxis: { type: 'category', data: [] }, yAxis: { type: 'value' }, series: [] };
    }

    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['基础信息', '附件材料', '命名规范', '版本留痕'],
      },
      yAxis: { type: 'value', max: 100 },
      grid: { left: 32, right: 20, top: 28, bottom: 40 },
      color: ['#18578f'],
      series: [
        {
          type: 'bar',
          barWidth: 24,
          data: [
            Math.min(100, activeMaterial.completeness + 6),
            Math.max(55, activeMaterial.completeness - 4),
            Math.max(50, activeCheck.score - 6),
            Math.max(48, activeCheck.score - 10),
          ],
        },
      ],
    };
  }, [activeCheck, activeMaterial]);

  return (
    <div className="filing-page">
      {contextHolder}
      <Card className="ui-card" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ materialId: materials[0]?.id }}
          onFinish={(values) => {
            const check = runMaterialCheck(values.materialId);

            if (check) {
              setSelectedMaterialId(values.materialId);
              void messageApi.success('材料完整性检查已完成');
            }
          }}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={18}>
              <Form.Item label="选择材料" name="materialId" rules={[{ required: true }]}>
                <Select
                  options={materials.map((material) => ({
                    label: `${material.name} · ${getFilingTypeLabel(material.filingType)}`,
                    value: material.id,
                  }))}
                  onChange={setSelectedMaterialId}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Space className="filing-check-actions">
                <Button type="primary" htmlType="submit">
                  开始检查
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {activeMaterial && activeCheck && activeDetail ? (
        <>
          <ResultSummary
            title={`${activeMaterial.name}检查结果`}
            riskLevel={
              activeCheck.score >= 90 ? 'low' : activeCheck.score >= 78 ? 'medium' : 'high'
            }
            status={activeCheck.status}
            description={`本次检查类型为 ${activeCheck.checkType}，系统会结合完成度、问题项和上传元数据给出综合评分。`}
            metrics={[
              { label: '检查得分', value: String(activeCheck.score) },
              { label: '材料类型', value: getFilingTypeLabel(activeMaterial.filingType) },
              { label: '上传文件数', value: String(activeDetail.uploads.length) },
              { label: '问题项数量', value: String(activeCheck.issues.length) },
            ]}
          />

          <Row gutter={[20, 20]}>
            <Col xs={24} xl={14}>
              <ChartCard
                title="完整性检查维度"
                subtitle="用于展示评分构成"
                option={chartOption}
                height={280}
              />
            </Col>
            <Col xs={24} xl={10}>
              <Card className="ui-card" bordered={false}>
                <Space direction="vertical" size={16} className="filing-list-stack">
                  <Typography.Title level={5} className="section-title">
                    问题清单
                  </Typography.Title>
                  {activeCheck.issues.map((issue) => (
                    <Card key={issue} className="filing-info-card">
                      <Typography.Paragraph className="filing-copy">
                        {issue}
                      </Typography.Paragraph>
                    </Card>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>

          <RegulationCitation
            title="法规依据"
            citations={getFilingCitations(activeDetail.citations)}
          />
        </>
      ) : null}
    </div>
  );
}
