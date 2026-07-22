# 数据跨境服务平台本地 App Demo

本项目是基于 Electron、React、TypeScript、Vite 和 Ant Design 构建的本地离线演示应用，用于展示数据跨境服务平台的核心业务流程与模块联动。

## 技术栈

- Electron
- React 19
- TypeScript
- Vite 7
- Ant Design 5
- Zustand
- ECharts

## 已完成范围

- 首页工作台
- 法规智库
- 合规研判
- 数据治理与评估
- 申报备案
- 安全流通
- 服务中心
- 报告中心
- 系统设置
- 全局搜索

## 本地启动

安装依赖：

```bash
npm install
```

仅启动 Web 开发环境：

```bash
npm run dev
```

启动 Electron 本地桌面预览：

```bash
npm run electron:dev
```

## 构建与打包

执行类型检查和构建：

```bash
npm run build
```

执行 Electron 打包：

```bash
npm run electron:build
```

打包产物默认输出到 `release/` 目录。

## 目录结构

```text
src/
  app/                路由、导航、应用状态
  components/         通用组件、布局组件、图表与表单
  mock/               本地演示数据
  pages/              各模块页面
  styles/             全局样式
  types/              业务类型定义
  utils/              下载、本地存储等工具
electron/             Electron 主进程与 preload
```

## 演示数据说明

- 所有业务数据均为本地 mock 数据，不依赖后端接口。
- 收藏、最近访问、部分工作区记录会写入浏览器 `localStorage`。
- 系统设置页支持查看和清理本地偏好数据。

## 演示入口建议

- 首页：查看九个一级模块与统计总览
- 全局搜索：跨法规、报告、资产、材料、服务机构统一检索
- 法规智库：查看法规库、国家画像、法规问答与法规比较
- 合规研判：完成场景预检、路径研判、清单识别与结果留痕
- 数据治理与评估：查看资产清单、重要数据识别、风险评估与 PIA
- 申报备案：查看材料中心、完整性检查和三类申报路径
- 报告中心：查看报告列表、详情预览和模拟下载
- 系统设置：查看最近访问与本地存储状态

## 相关文档

- [演示操作说明](./演示操作说明.md)
