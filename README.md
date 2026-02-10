# College-Entrance-Examination-physics-simulations

面向高考物理题型的仿真与可视化资源库：用于沉淀典型题目/题型的可运行案例，支持参数调整、结果复现与教学演示。

## 目录结构
- `problems/`：按题目或题型组织的仿真案例。
- `tools/`：通用脚本与辅助工具（数据处理、绘图、校验等）。
- `templates/`：案例模板与脚手架，便于快速新建仿真项目。

## 单个案例通用约定
建议每个案例目录采用如下结构：
- `simulate.py`：主仿真脚本。
- `params.json`：输入参数配置。
- `output/`：输出结果目录（轨迹、图像、数据文件等）。

示例：
```bash
python simulate.py --params params.json
```

## 说明
Git 不会追踪空目录，因此在目录中保留 `.gitkeep` 作为占位文件。
