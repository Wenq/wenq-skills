# 周开发进度汇报

根据开发工作内容自动生成格式化的周开发进度汇报。

## 安装

### 通过 Vercel Skills 安装（推荐）

```bash
npx skills add <username>/wenq-skills --skill weekly-dev-progress-report
```

### 手动安装

将 `skill.md` 文件内容复制到你的 AI IDE 中：

- **Cursor**: Settings > Cursor Settings > Features > Add Skill
- **Trae**: 设置 > 技能 > 添加技能
- **Claude Code**: 将 skill.md 放入 `.claude/skills/` 目录
- **GitHub Copilot**: 添加到 `.github/copilot-instructions.md`
- **其他 IDE**: 参考对应 IDE 的技能配置文档

## 使用方法

1. 在 IDE 对话框中输入 `/开发进度` 或粘贴开发工作内容
2. 系统自动解析并生成分类整理的进度汇报

## 输入格式

按业务域/模块记录的开发工作内容：

```
### 本周开发进度汇报

---

#### 一、AI编程能力

| 重点任务 | 具体内容 | 开发进度 |
| -------- | -------- | -------- |
| 任务名称 | 任务描述 | 进行中 |

---

#### 二、组件库

| 模块 | 重点任务 | 具体内容 | 开发进度 |
|------|----------|----------|----------|
| 模块名 | 任务名 | 描述 | 计划中 |

---

#### 五、关注项与依赖

- **事项名称**：具体说明
```

## 输出格式

```
### 本周开发进度汇报

---

#### 一、[业务域]
| 重点任务 | 具体内容 | 开发进度 |

#### 二、[业务域]
| 模块 | 重点任务 | 具体内容 | 开发进度 |

#### 五、关注项与依赖
- [事项]
```

## 文件结构

```
weekly-dev-progress-report/
├── skill.md          # Skill 定义文件（必需）
├── README.md         # 说明文档
├── examples/         # 示例文件
│   ├── input-example.md
│   └── output-example.md
└── templates/        # 模板文件
    └── progress-template.md
```

## 兼容 IDE

- ✅ Cursor
- ✅ Trae
- ✅ Claude Code
- ✅ GitHub Copilot
- ✅ 其他支持 Vercel Skills 标准的 IDE

## License

MIT
