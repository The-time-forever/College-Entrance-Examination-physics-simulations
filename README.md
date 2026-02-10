# College-Entrance-Examination-physics-simulations

一个面向高考物理电磁偏转题的交互式仿真网页项目，当前实现了 **Ion Deposition Simulator / 离子喷镀装置仿真** 的前端骨架（React + Canvas 2D）。

## 技术栈
- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui（Button / Card / Tabs / Slider / Input / Switch / Label）
- Zustand（参数、播放状态、结果管理）

## 本地运行
```bash
npm install
npm run dev
```

## 构建与预览
```bash
npm run build
npm run preview
```

## 在线演示（GitHub Pages）
推送到 `main` 后会通过 GitHub Actions 自动构建并部署到 GitHub Pages。

访问格式：`https://<user>.github.io/<repo>/`

## 目录结构
- `src/scenes/ion-deposition/`：场景渲染与占位物理计算
- `src/components/`：页面组件（画布、参数面板、结果面板）
- `src/components/ui/`：shadcn/ui 组件
- `src/store/`：Zustand 状态管理
- `.github/workflows/pages.yml`：Pages 自动部署工作流
- `problems/` `tools/` `templates/`：题库、工具、模板目录（空目录用 `.gitkeep` 跟踪）
