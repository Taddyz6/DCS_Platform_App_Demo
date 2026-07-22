import { Card, Radio, Space, Typography } from 'antd';
import type { QuestionnaireItem } from '@/types/ui';

interface QuestionnaireProps {
  title: string;
  questions: QuestionnaireItem[];
  values: Record<string, string | undefined>;
  onChange: (id: string, value: string) => void;
}

export function Questionnaire({
  title,
  questions,
  values,
  onChange,
}: QuestionnaireProps) {
  return (
    <Card className="ui-card questionnaire-card" bordered={false}>
      <Space direction="vertical" size={18} className="questionnaire-stack">
        <Typography.Title level={5} className="section-title">
          {title}
        </Typography.Title>
        {questions.map((question) => (
          <div key={question.id} className="questionnaire-item">
            <Typography.Text strong>{question.title}</Typography.Text>
            {question.description ? (
              <Typography.Paragraph className="questionnaire-copy">
                {question.description}
              </Typography.Paragraph>
            ) : null}
            <Radio.Group
              value={values[question.id]}
              onChange={(event) => onChange(question.id, event.target.value)}
            >
              <Space direction="vertical" size={10}>
                {question.options.map((option) => (
                  <Card key={option.value} className="questionnaire-option-card">
                    <Radio value={option.value}>{option.label}</Radio>
                    {option.description ? (
                      <Typography.Paragraph className="questionnaire-option-copy">
                        {option.description}
                      </Typography.Paragraph>
                    ) : null}
                  </Card>
                ))}
              </Space>
            </Radio.Group>
          </div>
        ))}
      </Space>
    </Card>
  );
}
