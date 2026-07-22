import { ConfigProvider, App as AntdApp, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';

const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#18578f',
    colorInfo: '#18578f',
    colorSuccess: '#2f7d4b',
    colorWarning: '#c27a19',
    colorError: '#c2413a',
    colorBgLayout: '#eef3f8',
    borderRadius: 14,
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  },
};

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={appTheme}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}
