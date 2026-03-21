# 周报生成助手

根据用户录入的周工作内容自动生成格式化周报。

## 功能说明

- 自动解析按日期记录的工作内容
- 智能分类整理（补丁与立项 / KWC / 需求对接 / 其他）
- 识别任务状态（重要🌟 / 完成 / 进行中）
- 生成标准格式的周报文本

## 安装方法

### Vercel Skills（推荐）

兼容所有支持 Vercel Skills 标准的 IDE：

```bash
npx skills add <your-github-username>/wenq-skills --skill weekly-report
```

### 手动安装

将 `SKILL.md` 复制到你的 IDE Skills 目录：

- **Cursor**: `~/.cursor/rules/weekly-report.md`
- **Trae**: `~/.trae/skills/weekly-report/`
- **Claude Code**: `~/.claude/skills/weekly-report/`

## 使用方法

### 1. 触发 Skill

在 IDE 对话框中输入以下任一关键词：
- `/周报`
- `/weekly`
- `生成周报`

### 2. 粘贴工作内容

将本周按日期记录的工作内容粘贴到对话框，例如：

```
2026/3/16（周一）：
1. 专利 - 技术交底书 （页面脚本）🌟
2. 紧急补丁 - A产品海外客户支持 -50%？🌟
3. KWC - 网站内容补全

2026/3/17：
1. KWC - 开发进度沟通 -ok
2. 补丁 - 基线验证 - ？
```

### 3. 获取周报

Skill 将自动生成分类整理后的周报：

```
1、本周重点进展
补丁与立项
- A产品海外客户紧急补丁支持
- 基线验证

KWC
- 网站内容补全
- 开发进度沟通

其他
- 专利 - 技术交底书（页面脚本）

2、当前阻塞/风险/需支持事项
- 基线验证（进行中）

3、下周核心计划
- 专利 - 技术交底书完善
```

## 文件结构

```
weekly-report/
├── README.md                  # 本文件
├── SKILL.md                   # Vercel Skills 标准文件（核心）
├── skill.md                   # 旧版 Skill 文件（兼容）
├── templates/
│   └── weekly-template.md     # 周报模板
├── examples/
│   ├── input-example.md       # 输入示例
│   └── output-example.md      # 输出示例
└── rules/
    └── formatting-rules.md    # 格式化规则
```

## 支持 IDE

- **Cursor** - 原生支持 Vercel Skills
- **Trae** - 原生支持 Vercel Skills
- **Claude Code** - 原生支持 Vercel Skills
- **GitHub Copilot** - 支持 AGENTS.md
- **Qoder** - 支持自定义 Skills
- **VSCode** - 需安装相应插件

## 版本信息

- 版本: 1.0.0
- 作者: Alan
- 许可证: MIT
- 标准: [Vercel Skills](https://skills.sh/)
