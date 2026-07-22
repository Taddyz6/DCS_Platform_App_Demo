import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '@/components/common/ModuleCard';
import { RegulationCitation } from '@/components/common/RegulationCitation';
import { StatCard } from '@/components/common/StatCard';
import { countryProfiles, getRelatedRegulations } from './data';

export function CountryProfilesPage() {
  const navigate = useNavigate();
  const [selectedCountryName, setSelectedCountryName] = useState(countryProfiles[0]?.name);

  const selectedCountry = useMemo(
    () =>
      countryProfiles.find((item) => item.name === selectedCountryName) ??
      countryProfiles[0],
    [selectedCountryName],
  );

  const relatedRegulations = getRelatedRegulations(selectedCountry.keyRegulationIds);

  return (
    <div className="regulations-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <StatCard
            title="国家/地区"
            value={countryProfiles.length}
            suffix="个"
            description="支持中国、欧盟、德国、新加坡、日本、中国香港和蒙古。"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="当前选择"
            value={selectedCountry.name}
            description={`所属区域：${selectedCountry.region}`}
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="重点法规"
            value={selectedCountry.keyRegulationIds.length}
            suffix="部"
            description="与当前国家画像直接关联的法规与机制。"
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={16} className="regulation-list-stack">
              <Typography.Title level={5} className="section-title">
                国家列表
              </Typography.Title>
              <Space direction="vertical" size={12} className="country-list-stack">
                {countryProfiles.map((item) => (
                  <Button
                    key={item.id}
                    type={selectedCountry.name === item.name ? 'primary' : 'default'}
                    block
                    onClick={() => setSelectedCountryName(item.name)}
                  >
                    {item.name}
                  </Button>
                ))}
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={16}>
          <Card className="ui-card" bordered={false}>
            <Space direction="vertical" size={18} className="country-detail-stack">
              <div className="regulation-section-head">
                <Typography.Title level={4} className="country-detail-title">
                  {selectedCountry.name} 合规画像
                </Typography.Title>
                <Tag color="blue">{selectedCountry.region}</Tag>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <RegulationCitation
                    title="监管机构"
                    citations={selectedCountry.regulatoryAuthorities.map((item, index) => ({
                      id: `${selectedCountry.id}-authority-${index}`,
                      title: item,
                      article: '监管机构',
                      summary: '用于展示该国家或地区在数据和隐私领域的主要监管主体。',
                    }))}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <RegulationCitation
                    title="跨境传输机制"
                    citations={selectedCountry.crossBorderMechanisms.map((item, index) => ({
                      id: `${selectedCountry.id}-mechanism-${index}`,
                      title: item,
                      article: '跨境机制',
                      summary: '用于法规比较、问答引用和路径判断说明。',
                    }))}
                  />
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card className="country-info-card">
                    <Space direction="vertical" size={10}>
                      <Typography.Title level={5} className="section-title">
                        数据本地化要求
                      </Typography.Title>
                      {selectedCountry.localizationRequirements.map((item) => (
                        <Tag key={item} className="country-requirement-tag">
                          {item}
                        </Tag>
                      ))}
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card className="country-info-card">
                    <Space direction="vertical" size={10}>
                      <Typography.Title level={5} className="section-title">
                        重点风险
                      </Typography.Title>
                      {selectedCountry.keyRisks.map((item) => (
                        <Tag key={item} color="warning">
                          {item}
                        </Tag>
                      ))}
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <RegulationCitation
            title="常见问题"
            citations={selectedCountry.faqs.map((item, index) => ({
              id: `${selectedCountry.id}-faq-${index}`,
              title: item.question,
              article: 'FAQ',
              summary: item.answer,
            }))}
          />
        </Col>
        <Col xs={24} xl={12}>
          <Row gutter={[16, 16]}>
            {relatedRegulations.map((item) => (
              <Col span={24} key={item.id}>
                <ModuleCard
                  title={item.title}
                  description={item.summary}
                  icon={<span className="feature-dot" />}
                  meta={`${item.level} · ${item.publishDate}`}
                  actionLabel="查看法规详情"
                  onAction={() => navigate(`/regulations/detail/${item.id}`)}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
