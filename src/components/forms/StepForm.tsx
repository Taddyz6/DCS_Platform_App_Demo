import type { ReactNode } from 'react';
import { Button, Card, Space, Steps, Typography } from 'antd';

interface StepItem {
  key: string;
  title: string;
  description: string;
}

interface StepFormProps {
  title: string;
  currentStep: number;
  steps: StepItem[];
  content: ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
}

export function StepForm({
  title,
  currentStep,
  steps,
  content,
  onPrev,
  onNext,
  onSubmit,
}: StepFormProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Card className="ui-card step-form-card" bordered={false}>
      <Space direction="vertical" size={18} className="step-form-stack">
        <Typography.Title level={5} className="section-title">
          {title}
        </Typography.Title>
        <Steps
          current={currentStep}
          items={steps.map((step) => ({
            key: step.key,
            title: step.title,
            description: step.description,
          }))}
        />
        <div className="step-form-content">{content}</div>
        <Space wrap>
          <Button disabled={isFirstStep} onClick={onPrev}>
            上一步
          </Button>
          {isLastStep ? (
            <Button type="primary" onClick={onSubmit}>
              生成结果
            </Button>
          ) : (
            <Button type="primary" onClick={onNext}>
              下一步
            </Button>
          )}
        </Space>
      </Space>
    </Card>
  );
}
