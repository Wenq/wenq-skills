# wenq-skills

个人相关事务处理，将处理逻辑转为对应 skills，便于给 AI 工具使用，提升个人工作效率。

## Skills 列表

| Skill | 描述 | 触发词 |
|-------|------|--------|
| [weekly-report](./skills/weekly-report/) | 自动生成格式化工作周报 | `/周报`, `/weekly` |

## 使用方法

1. 在支持的 IDE（Qoder、Trae 等）中配置 Skill 路径
2. 在对话框输入对应触发词即可使用

## 目录结构

```
wenq-skills/
├── README.md              # 本文件
├── LICENSE                # MIT 许可证
└── skills/                # Skills 根目录
    └── weekly-report/     # 周报 Skill
        ├── skill.md       # Skill 核心规则
        ├── templates/     # 模板文件
        ├── examples/      # 示例文件
        └── rules/         # 规则定义
```

## 添加新 Skill

1. 在 `skills/` 目录下创建新文件夹
2. 创建 `skill.md` 作为 Skill 入口文件
3. 参考 [weekly-report](./skills/weekly-report/) 结构组织文件
4. 更新本 README 的 Skills 列表

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件
