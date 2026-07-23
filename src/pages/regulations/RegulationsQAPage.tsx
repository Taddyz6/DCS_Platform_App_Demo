import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { EmptyState } from '@/components/common/EmptyState';
import { getCountryProfileByName, qaSuggestedQuestions, regulations } from './data';

interface QaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    title: string;
    article: string;
    summary: string;
  }>;
}

const buildAnswer = (question: string) => {
  const normalized = question.toLowerCase();

  if (normalized.includes('新加坡')) {
    const profile = getCountryProfileByName('新加坡');
    const regulation = regulations.find((item) => item.id === 'reg-sg-pdpa');

    return {
      content:
        '道路测试数据出境通常需要先识别车辆轨迹、环境感知和驾驶员相关信息的属性，再说明新加坡研发中心的保护水平、合同安排和内部责任边界。对于中国出境方，还应判断是否适用安全评估或标准合同路径。',
      citations: [
        {
          title: regulation?.title ?? 'Personal Data Protection Act',
          article: '跨境传输与责任要求',
          summary: regulation?.summary ?? '',
        },
        {
          title: `${profile?.name} 画像`,
          article: '跨境机制',
          summary: profile?.crossBorderMechanisms.join('；') ?? '',
        },
      ],
    };
  }

  if (normalized.includes('道路测试')) {
    const automotiveGuide = regulations.find(
      (item) => item.id === 'reg-cn-auto-guide-2026',
    );
    const securityAssessment = regulations.find(
      (item) => item.id === 'reg-cn-security-assessment',
    );

    return {
      content:
        '道路测试数据出境应先识别车辆轨迹、环境感知、高精度位置及驾驶员相关信息的属性，再结合目的地、接收方保护能力和数据规模判断安全评估或标准合同路径。',
      citations: [
        {
          title: automotiveGuide?.title ?? '汽车数据出境安全指引（2026）',
          article: '汽车道路测试数据',
          summary: automotiveGuide?.summary ?? '',
        },
        {
          title: securityAssessment?.title ?? '数据出境安全评估办法',
          article: '安全评估适用条件',
          summary: securityAssessment?.summary ?? '',
        },
      ],
    };
  }

  if (normalized.includes('重要数据') || normalized.includes('汽车')) {
    const regulation = regulations.find((item) => item.id === 'reg-cn-dsl');

    return {
      content:
        '汽车研发数据、设备日志和高精度位置数据可能涉及重要数据辅助识别。演示系统不会直接给出行政认定，而是提示需要进一步核查行业场景、数据敏感度和流向。',
      citations: [
        {
          title: regulation?.title ?? '数据安全法',
          article: '数据分类分级',
          summary: regulation?.summary ?? '',
        },
      ],
    };
  }

  if (normalized.includes('gdpr') || normalized.includes('欧盟')) {
    const profile = getCountryProfileByName('欧盟');
    const regulation = regulations.find((item) => item.id === 'reg-eu-gdpr');

    return {
      content:
        '在欧盟场景中，常见的跨境工具包括充分性认定、标准合同条款和具有约束力的公司规则。选择具体机制时，还要结合接收国风险和附加保护措施。',
      citations: [
        {
          title: regulation?.title ?? 'GDPR',
          article: '跨境传输机制',
          summary: regulation?.summary ?? '',
        },
        {
          title: `${profile?.name} 画像`,
          article: '常见机制',
          summary: profile?.crossBorderMechanisms.join('；') ?? '',
        },
      ],
    };
  }

  if (normalized.includes('标准合同') || normalized.includes('安全评估')) {
    const standardContract = regulations.find(
      (item) => item.id === 'reg-cn-standard-contract',
    );
    const assessment = regulations.find(
      (item) => item.id === 'reg-cn-security-assessment',
    );

    return {
      content:
        '系统会先判断是否命中特定高风险场景或规模门槛，若命中则优先进入安全评估路径；若未命中，再继续评估标准合同等其他机制。',
      citations: [
        {
          title: assessment?.title ?? '数据出境安全评估办法',
          article: '适用条件',
          summary: assessment?.summary ?? '',
        },
        {
          title: standardContract?.title ?? '个人信息出境标准合同办法',
          article: '适用条件',
          summary: standardContract?.summary ?? '',
        },
      ],
    };
  }

  const defaultRegulation = regulations[0];

  return {
    content:
      '当前问题未命中特定规则。你可以改问国家、机制、行业场景或法规名称，系统会基于知识规则返回更准确的答案。',
    citations: [
      {
        title: defaultRegulation.title,
        article: defaultRegulation.articles[0]?.title ?? '条款 1',
        summary: defaultRegulation.summary,
      },
    ],
  };
};

export function RegulationsQAPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<QaMessage[]>([]);

  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((item) => item.role === 'assistant'),
    [messages],
  );

  const submitQuestion = (question: string) => {
    const content = question.trim();

    if (!content) {
      return;
    }

    const answer = buildAnswer(content);

    setMessages((current) => [
      ...current,
      {
        id: `user-${current.length + 1}`,
        role: 'user',
        content,
      },
      {
        id: `assistant-${current.length + 2}`,
        role: 'assistant',
        content: answer.content,
        citations: answer.citations,
      },
    ]);
    setInputValue('');
  };

  return (
    <div className="regulations-page">
      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="qa-page-stack">
          <Typography.Title level={5} className="section-title">
            推荐问题
          </Typography.Title>
          <Space wrap>
            {qaSuggestedQuestions.map((question) => (
              <Button key={question} onClick={() => submitQuestion(question)}>
                {question}
              </Button>
            ))}
            <Button onClick={() => setMessages([])}>清空会话</Button>
          </Space>
        </Space>
      </Card>

      <Card className="ui-card" bordered={false}>
        <Space direction="vertical" size={16} className="qa-page-stack">
          <Typography.Title level={5} className="section-title">
            对话区域
          </Typography.Title>
          <div className="qa-chat-box">
            {messages.length === 0 ? (
              <EmptyState
                title="尚未开始问答"
                description="点击推荐问题，或输入国家、法规名称、场景关键字开始法规问答。"
              />
            ) : (
              <Space direction="vertical" size={14} className="qa-message-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`qa-message qa-message-${message.role}`}
                  >
                    <Tag color={message.role === 'user' ? 'blue' : 'green'}>
                      {message.role === 'user' ? '用户问题' : '系统回答'}
                    </Tag>
                    <Typography.Paragraph className="qa-message-copy">
                      {message.content}
                    </Typography.Paragraph>
                  </div>
                ))}
              </Space>
            )}
          </div>
          <Input.Search
            value={inputValue}
            placeholder="输入法规、国家、传输机制或场景问题"
            enterButton={<SendOutlined />}
            onChange={(event) => setInputValue(event.target.value)}
            onSearch={submitQuestion}
          />
        </Space>
      </Card>

      {latestAssistantMessage?.citations ? (
        <RegulationCitation
          title="条款引用与相关依据"
          citations={latestAssistantMessage.citations.map((item, index) => ({
            id: `${latestAssistantMessage.id}-citation-${index}`,
            title: item.title,
            article: item.article,
            summary: item.summary,
          }))}
        />
      ) : null}
    </div>
  );
}
