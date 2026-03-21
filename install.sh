#!/bin/bash

# wenq-skills 安装脚本
# 一键配置 Skill 到各 IDE

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_NAME="weekly-report"
SKILL_PATH="${SCRIPT_DIR}/skills/${SKILL_NAME}"

echo "=========================================="
echo "  wenq-skills 安装工具"
echo "=========================================="
echo ""

# 检查 Skill 目录是否存在
if [ ! -d "$SKILL_PATH" ]; then
    echo "错误: 找不到 Skill 目录: $SKILL_PATH"
    exit 1
fi

# 检测操作系统
OS="unknown"
case "$(uname -s)" in
    Darwin*)    OS="macOS";;
    Linux*)     OS="Linux";;
    CYGWIN*|MINGW*|MSYS*) OS="Windows";;
esac

echo "检测到操作系统: $OS"
echo ""

# 安装到 Qoder
install_qoder() {
    echo "正在配置 Qoder..."
    
    # Qoder 配置目录
    QODER_CONFIG_DIR=""
    if [ "$OS" = "macOS" ]; then
        QODER_CONFIG_DIR="$HOME/Library/Application Support/Qoder"
    elif [ "$OS" = "Linux" ]; then
        QODER_CONFIG_DIR="$HOME/.config/Qoder"
    fi
    
    if [ -n "$QODER_CONFIG_DIR" ] && [ -d "$QODER_CONFIG_DIR" ]; then
        # 创建 skills 软链接
        QODER_SKILLS_DIR="$QODER_CONFIG_DIR/skills"
        mkdir -p "$QODER_SKILLS_DIR"
        
        # 如果已存在，先删除
        if [ -L "$QODER_SKILLS_DIR/$SKILL_NAME" ]; then
            rm "$QODER_SKILLS_DIR/$SKILL_NAME"
        fi
        
        ln -s "$SKILL_PATH" "$QODER_SKILLS_DIR/$SKILL_NAME"
        echo "  ✓ Qoder 配置完成"
        echo "    Skill 路径: $QODER_SKILLS_DIR/$SKILL_NAME"
    else
        echo "  ⚠ 未检测到 Qoder 配置目录"
        echo "    请手动在 Qoder 设置中添加 Skill 路径:"
        echo "    $SKILL_PATH"
    fi
    echo ""
}

# 安装到 Trae
install_trae() {
    echo "正在配置 Trae..."
    
    # Trae 全局配置目录
    TRAE_CONFIG_DIR=""
    if [ "$OS" = "macOS" ]; then
        TRAE_CONFIG_DIR="$HOME/Library/Application Support/Trae"
    elif [ "$OS" = "Linux" ]; then
        TRAE_CONFIG_DIR="$HOME/.config/Trae"
    elif [ "$OS" = "Windows" ]; then
        TRAE_CONFIG_DIR="$HOME/AppData/Roaming/Trae"
    fi
    
    if [ -n "$TRAE_CONFIG_DIR" ]; then
        TRAE_SKILLS_DIR="$TRAE_CONFIG_DIR/skills"
        mkdir -p "$TRAE_SKILLS_DIR"
        
        # 如果已存在，先删除
        if [ -L "$TRAE_SKILLS_DIR/$SKILL_NAME" ]; then
            rm "$TRAE_SKILLS_DIR/$SKILL_NAME"
        fi
        
        ln -s "$SKILL_PATH" "$TRAE_SKILLS_DIR/$SKILL_NAME"
        echo "  ✓ Trae 全局配置完成"
        echo "    Skill 路径: $TRAE_SKILLS_DIR/$SKILL_NAME"
    else
        echo "  ⚠ 无法确定 Trae 配置目录"
    fi
    echo ""
}

# 安装到 Cursor
install_cursor() {
    echo "正在配置 Cursor..."
    
    # Cursor 配置目录
    CURSOR_CONFIG_DIR=""
    if [ "$OS" = "macOS" ]; then
        CURSOR_CONFIG_DIR="$HOME/Library/Application Support/Cursor"
    elif [ "$OS" = "Linux" ]; then
        CURSOR_CONFIG_DIR="$HOME/.config/Cursor"
    elif [ "$OS" = "Windows" ]; then
        CURSOR_CONFIG_DIR="$HOME/AppData/Roaming/Cursor"
    fi
    
    if [ -n "$CURSOR_CONFIG_DIR" ]; then
        CURSOR_RULES_DIR="$CURSOR_CONFIG_DIR/rules"
        mkdir -p "$CURSOR_RULES_DIR"
        
        # 复制 skill.md 作为规则文件
        cp "$SKILL_PATH/skill.md" "$CURSOR_RULES_DIR/${SKILL_NAME}.md"
        echo "  ✓ Cursor 配置完成"
        echo "    规则文件: $CURSOR_RULES_DIR/${SKILL_NAME}.md"
    else
        echo "  ⚠ 无法确定 Cursor 配置目录"
    fi
    echo ""
}

# 显示手动配置说明
show_manual_guide() {
    echo "=========================================="
    echo "  手动配置指南"
    echo "=========================================="
    echo ""
    echo "如果自动配置未生效，请手动添加 Skill:"
    echo ""
    echo "Qoder:"
    echo "  设置 → Skills → 添加 Skill 目录"
    echo "  路径: $SKILL_PATH"
    echo ""
    echo "Trae:"
    echo "  方法一 - 全局配置:"
    echo "    将 $SKILL_PATH 复制到 ~/.trae/skills/"
    echo ""
    echo "  方法二 - 项目配置:"
    echo "    将 $SKILL_PATH 复制到项目根目录的 .trae/skills/"
    echo ""
    echo "Cursor:"
    echo "  将 skill.md 复制到 ~/.cursor/rules/"
    echo "  或项目根目录的 .cursorrules"
    echo ""
    echo "VSCode (Continue 插件):"
    echo "  在 Continue 配置中添加 system prompt"
    echo "  内容参考: $SKILL_PATH/skill.md"
    echo ""
}

# 主菜单
main() {
    echo "请选择要配置的 IDE:"
    echo ""
    echo "  1) 配置所有支持的 IDE"
    echo "  2) 仅配置 Qoder"
    echo "  3) 仅配置 Trae"
    echo "  4) 仅配置 Cursor"
    echo "  5) 显示手动配置指南"
    echo "  0) 退出"
    echo ""
    read -p "请输入选项 [0-5]: " choice
    
    case $choice in
        1)
            install_qoder
            install_trae
            install_cursor
            ;;
        2)
            install_qoder
            ;;
        3)
            install_trae
            ;;
        4)
            install_cursor
            ;;
        5)
            show_manual_guide
            exit 0
            ;;
        0)
            echo "退出安装"
            exit 0
            ;;
        *)
            echo "无效选项"
            exit 1
            ;;
    esac
    
    echo "=========================================="
    echo "  安装完成!"
    echo "=========================================="
    echo ""
    echo "使用方法:"
    echo "  在 IDE 对话框中输入: /周报 或 /weekly"
    echo "  然后粘贴你的周工作内容即可"
    echo ""
    echo "触发词:"
    echo "  - /周报"
    echo "  - /weekly"
    echo "  - 生成周报"
    echo ""
}

# 运行主程序
main
