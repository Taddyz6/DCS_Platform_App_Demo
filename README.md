# 数据跨境服务平台 App Demo

基于 **Electron + React + TypeScript** 构建的本地离线演示应用，用于展示数据跨境服务平台的主要业务流程及模块联动。

> **版权声明**
>
> Copyright © 2026 Taddyz6. All Rights Reserved.
>
> 本项目的源代码、界面设计、业务流程、文档及相关素材均受版权保护。未经版权所有者书面授权，不得复制、修改、分发、公开展示、出售、转授权或用于任何商业用途。

## 主要功能

* 法规智库与合规研判
* 数据治理与风险评估
* 申报备案与材料管理
* 数据安全流通
* 服务中心与报告中心
* 全局搜索与系统设置

所有业务数据均为本地 Mock 数据，不依赖后端服务。

## 技术栈

Electron · React 19 · TypeScript · Vite 7 · Ant Design 5 · Zustand · ECharts

## 本地运行

```bash
npm install
npm run electron:dev
```

仅启动 Web 开发环境：

```bash
npm run dev
```

构建与打包：

```bash
npm run build
npm run electron:build
```

打包产物默认输出至 `release/`。

## 文档

* [演示操作说明](./演示操作说明.md)

## 使用限制

本仓库仅用于项目演示、内部评审及经授权的技术交流。仓库公开可见不代表授予任何开源许可或其他使用权。
