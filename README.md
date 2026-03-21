# wenq-skills

个人相关事务处理，将处理逻辑转为对应 skills，便于给 AI 工具使用，提升个人工作效率。

> **说明**：本 Skill 仓库内容，初始基于 Qoder 下创建，现已适配 Vercel Skills 标准，支持 Cursor、Trae、Claude Code 等 18+ AI agents。

## Skills 列表

| Skill | 描述 | 触发词 |
|-------|------|--------|
| [weekly-report](./skills/weekly-report/) | 自动生成格式化工作周报 | `/周报`, `/weekly` |

## 安装方案

本仓库提供 **4 种安装方式**，根据你的需求选择最适合的方案：

### 方案一：Vercel Skills（推荐 ⭐）

**适用场景**：使用 Cursor、Trae、Claude Code 等支持 Vercel Skills 标准的 IDE

**优点**：
- 一条命令完成安装
- 支持 18+ AI agents
- 自动同步更新
- 行业标准生态

```bash
# 安装指定 Skill
npx skills add <your-github-username>/wenq-skills --skill weekly-report

# 安装到全局（所有项目可用）
npx skills add -g <your-github-username>/wenq-skills --skill weekly-report

# 列出仓库中所有 Skills
npx skills add <your-github-username>/wenq-skills --list
```

**支持的 IDE**：Cursor、Trae、Claude Code、GitHub Copilot、Windsurf 等

---

### 方案二：npx 一键安装（自定义 CLI）

**适用场景**：需要更灵活的安装控制，或 IDE 不完全支持 Vercel Skills

**优点**：
- 交互式安装向导
- 可选择安装到特定 IDE
- 支持离线安装

```bash
# 直接从 npm 运行（无需安装）
npx wenq-skills

# 安装所有 Skills
npx wenq-skills install

# 安装指定 Skill
npx wenq-skills install weekly-report

# 安装到指定 IDE
npx wenq-skills install weekly-report --ide qoder

# 查看帮助
npx wenq-skills help
```

**支持的 IDE**：Qoder、Trae、Cursor、VSCode

---

### 方案三：Shell 脚本安装

**适用场景**：喜欢命令行操作，或需要自定义安装路径

**优点**：
- 无需 Node.js 环境
- 支持创建软链接（方便更新）
- 可查看手动配置指南

```bash
# 1. 克隆仓库
git clone <仓库地址>
cd wenq-skills

# 2. 运行安装脚本
./install.sh

# 脚本会提示选择：
# - 配置所有 IDE
# - 仅配置 Qoder
# - 仅配置 Trae
# - 仅配置 Cursor
# - 显示手动配置指南
```

**系统要求**：Bash 环境（macOS/Linux 原生支持，Windows 需 Git Bash 或 WSL）

---

### 方案四：手动安装

**适用场景**：完全自定义安装，或 IDE 有特殊配置要求

**步骤**：

#### Cursor
```bash
# 复制 SKILL.md 到 Cursor 规则目录
cp skills/weekly-report/SKILL.md ~/.cursor/rules/weekly-report.md
```

#### Trae
```bash
# 创建 Skill 目录并复制
mkdir -p ~/.trae/skills/weekly-report
cp skills/weekly-report/SKILL.md ~/.trae/skills/weekly-report/
```

#### Claude Code
```bash
# 创建 Skill 目录并复制
mkdir -p ~/.claude/skills/weekly-report
cp skills/weekly-report/SKILL.md ~/.claude/skills/weekly-report/
```

#### Qoder
```bash
# 在 Qoder 设置中添加 Skill 路径
# Settings → Skills → Add Skill Directory
# 选择: /path/to/wenq-skills/skills/weekly-report
```

---

## 方案对比

| 方案 | 命令 | 难度 | 适用 IDE | 推荐度 |
|------|------|------|---------|--------|
| **Vercel Skills** | `npx skills add` | ⭐ 最简单 | 18+ agents | ⭐⭐⭐⭐⭐ |
| **npx 安装** | `npx wenq-skills` | ⭐⭐ 简单 | Qoder/Trae/Cursor | ⭐⭐⭐⭐ |
| **Shell 脚本** | `./install.sh` | ⭐⭐⭐ 中等 | Qoder/Trae/Cursor | ⭐⭐⭐ |
| **手动安装** | `cp` 命令 | ⭐⭐⭐⭐ 复杂 | 所有 IDE | ⭐⭐ |

**建议**：
- 使用 **Cursor/Trae/Claude Code** → 选 **方案一**
- 使用 **Qoder** → 选 **方案二或三**
- 需要 **完全自定义** → 选 **方案四**

## 使用方法

1. 安装完成后，在 IDE 对话框输入触发词：`/周报` 或 `/weekly`
2. 粘贴你的周工作内容
3. 自动生成格式化周报

## 支持的 IDE

- **Qoder** - 自动配置到 Skills 目录
- **Trae** - 自动配置全局 Skills
- **Cursor** - 自动复制规则文件
- **VSCode** - 需手动配置（见 install.sh 菜单选项 5）

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
