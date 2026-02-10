# 高考物理仿真项目（离子沉积装置）

本项目是一个基于前端技术栈构建的交互式仿真应用，用于演示高考物理中电磁偏转相关情境（离子在装置中的轨迹与打点结果）。

## 功能简介

- 参数调节：支持 `L`、`B`、`U`、`UNM` 等参数输入与滑块同步调节。
- 粒子切换：支持 `a`、`b` 两类粒子轨迹查看。
- 轨迹可视化：基于 Canvas 实时绘制装置结构与粒子轨迹。
- 结果面板：展示粒子落点坐标、命中表面与是否落在极板上。
- 参数导出：支持复制或下载当前参数 JSON。

## 技术栈

- `React 18`
- `TypeScript 5`
- `Vite 6`
- `Tailwind CSS 3`
- `Zustand`
- `Radix UI` + `shadcn/ui` 组件风格

## 环境要求

- `Node.js 20+`（与 GitHub Actions 配置一致）
- `npm 10+`（建议）

## 安装与运行

```bash
npm install
npm run dev
```

默认开发地址通常为：`http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run preview
```

构建产物目录：`dist/`

## 部署说明（GitHub Pages）

仓库内置了 GitHub Pages 工作流：`.github/workflows/pages.yml`。

- 工作流使用 `npm ci` 安装依赖。
- 构建时通过环境变量 `BASE_PATH` 注入站点基路径：
  - `BASE_PATH=/${{ github.event.repository.name }}/`
- Vite 配置读取该变量并设置 `base`，以适配 Pages 子路径部署。

## 项目结构

```text
.
├─ .github/workflows/pages.yml
├─ src/
│  ├─ components/               # 页面组件与 UI 组件
│  ├─ scenes/ion-deposition/    # 仿真计算与绘图逻辑
│  ├─ store/useSimStore.ts      # Zustand 状态管理
│  ├─ lib/utils.ts              # 工具函数（cn）
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ tailwind.config.ts
├─ vite.config.ts
└─ package.json
```

## 常见问题

### 1) `Cannot find module '@/lib/utils'`

请确认 `src/lib/utils.ts` 存在，并且 `tsconfig.app.json` 中包含路径别名：

- `"@/*": ["./src/*"]`

### 2) CI 中 `npm ci` 失败

`npm ci` 依赖 `package-lock.json`。请确保 lockfile 已提交到仓库。

### 3) 中文显示乱码

请确认以下编码设置：

- 源码文件编码：`UTF-8`
- 终端编码：支持 UTF-8（例如 PowerShell 使用 UTF-8）
- 编辑器编码：`UTF-8`，避免以 ANSI/GBK 保存

## 许可证

[MIT](./LICENSE)
