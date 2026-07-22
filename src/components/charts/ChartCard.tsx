import { useEffect, useRef } from 'react';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { Card, Typography } from 'antd';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  option: EChartsOption;
  height?: number;
}

export function ChartCard({
  title,
  subtitle,
  option,
  height = 320,
}: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    chart.setOption(option);

    const observer = new ResizeObserver(() => {
      chart.resize();
    });

    observer.observe(chartRef.current);

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return (
    <Card className="ui-card chart-card" bordered={false}>
      <div className="chart-card-head">
        <Typography.Title level={5} className="section-title">
          {title}
        </Typography.Title>
        {subtitle ? (
          <Typography.Text className="chart-card-subtitle">
            {subtitle}
          </Typography.Text>
        ) : null}
      </div>
      <div ref={chartRef} style={{ height }} />
    </Card>
  );
}
