import { useState } from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, message, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd';
import type { AppRouteMeta } from '@/app/navigation';
import {
  playgroundCitations,
  playgroundDocumentSections,
  playgroundQuestionnaireItems,
  playgroundSearchFilters,
  scenarios,
} from '@/mock';
import { ConfirmDialog } from './ConfirmDialog';
import { DataTable } from './DataTable';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';
import { RegulationCitation } from './RegulationCitation';
import { ResultSummary } from './ResultSummary';
import { SearchFilterBar } from './SearchFilterBar';
import { StatusTag } from './StatusTag';
import { StepForm } from '@/components/forms/StepForm';
import { Questionnaire } from '@/components/forms/Questionnaire';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { UploadPanel } from '@/components/documents/UploadPanel';

interface FeatureRecord {
  key: string;
  name: string;
  owner: string;
  status: 'draft' | 'analyzing' | 'completed' | 'pending';
}

const featureColumns: ColumnsType<FeatureRecord> = [
  {
    title: '功能项',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '负责域',
    dataIndex: 'owner',
    key: 'owner',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: FeatureRecord['status']) => <StatusTag status={status} />,
  },
];

interface ComponentPlaygroundProps {
  route: AppRouteMeta;
}

export function ComponentPlayground({ route }: ComponentPlaygroundProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const featureData: FeatureRecord[] = route.features.map((feature, index) => ({
    key: feature,
    name: feature,
    owner: index % 2 === 0 ? route.sectionLabel : '通用组件层',
    status:
      index === 0 ? 'completed' : index === 1 ? 'analyzing' : 'pending',
  }));

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size={20} className="component-playground">
        <SearchFilterBar
          keyword={keyword}
          keywordPlaceholder={`搜索 ${route.title} 相关占位能力`}
          filters={playgroundSearchFilters}
          values={filters}
          onKeywordChange={setKeyword}
          onFilterChange={(key, value) =>
            setFilters((current) => ({ ...current, [key]: value }))
          }
          onReset={() => {
            setKeyword('');
            setFilters({});
          }}
          onSearch={() => {
            void messageApi.success('已触发搜索');
          }}
        />

        <DataTable columns={featureColumns} dataSource={featureData} rowKey="key" />

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <StepForm
              title="步骤式表单组件预览"
              currentStep={currentStep}
              steps={[
                {
                  key: 'basic',
                  title: '基础信息',
                  description: scenarios[0]?.industry ?? '场景与主体',
                },
                { key: 'data', title: '数据类型', description: '数据范围与目的' },
                { key: 'result', title: '结果确认', description: '生成分析结论' },
              ]}
              content={
                <Card className="step-form-inner-card">
                  <Typography.Paragraph className="step-form-inner-copy">
                    当前步骤：{currentStep + 1}。这里已经切换为独立业务数据来源，后续页面只需要消费这些业务数据即可。
                  </Typography.Paragraph>
                  <Button type="dashed" onClick={() => setConfirmOpen(true)}>
                    打开二次确认弹窗
                  </Button>
                </Card>
              }
              onPrev={() => setCurrentStep((value) => Math.max(0, value - 1))}
              onNext={() => setCurrentStep((value) => Math.min(2, value + 1))}
              onSubmit={() => {
                void messageApi.success('已生成结果');
              }}
            />
          </Col>
          <Col xs={24} xl={12}>
            <Questionnaire
              title="问卷组件预览"
              questions={playgroundQuestionnaireItems}
              values={answers}
              onChange={(id, value) =>
                setAnswers((current) => ({ ...current, [id]: value }))
              }
            />
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={14}>
            <DocumentPreview
              title={`${route.title}报告`}
              subtitle="支持后续对接实时预览、自动保存和文档下载。"
              sections={playgroundDocumentSections}
            />
          </Col>
          <Col xs={24} xl={10}>
            <UploadPanel
              title="上传组件预览"
              fileList={fileList}
              onChange={setFileList}
            />
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={12}>
            <ResultSummary
              title="结果摘要组件预览"
              riskLevel="medium"
              status="analyzing"
              description="该区域当前已由独立业务数据驱动，后续只需把具体业务页面接到对应数据集。"
              metrics={[
                { label: '推荐路径', value: scenarios[1]?.recommendedPath ?? '标准合同备案' },
                { label: '需补充信息', value: '3 项' },
                { label: '命中法规', value: `${playgroundCitations.length} 部` },
                { label: '页面完成度', value: '82%' },
              ]}
            />
          </Col>
          <Col xs={24} xl={12}>
            <RegulationCitation citations={playgroundCitations} />
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} xl={8}>
            <Card className="ui-card">
              <LoadingState
                title="加载状态组件"
                description="用于分析、报告生成和材料检查等耗时流程。"
              />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
            <Card className="ui-card">
              <EmptyState
                title="空状态组件"
                description="用于无搜索结果、无历史记录或无上传材料场景。"
                actionLabel="创建首条记录"
                onAction={() => {
                  void messageApi.info('已触发创建');
                }}
                icon={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
            <Card className="ui-card">
              <ErrorState
                title="异常状态组件"
                description="用于演示规则服务异常、报告生成失败或页面加载失败。"
                actionLabel="重新加载"
                onAction={() => {
                  void messageApi.warning('已触发重试');
                }}
              />
            </Card>
          </Col>
        </Row>
      </Space>

      <ConfirmDialog
        open={confirmOpen}
        title="确认执行当前操作"
        description="该弹窗用于统一承接删除、重置、关闭事项和提交等二次确认操作。"
        confirmText="确认执行"
        cancelText="暂不处理"
        onConfirm={() => {
          setConfirmOpen(false);
          void messageApi.success('操作已确认');
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
