#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`)
};

// 获取 Skills 源目录
const PACKAGE_DIR = path.dirname(__dirname);
const SKILLS_DIR = path.join(PACKAGE_DIR, 'skills');

// IDE 配置目录
function getIDEConfigDirs() {
  const home = os.homedir();
  const platform = os.platform();
  
  const configs = {
    qoder: null,
    trae: null,
    cursor: null
  };
  
  if (platform === 'darwin') {
    configs.qoder = path.join(home, 'Library', 'Application Support', 'Qoder');
    configs.trae = path.join(home, 'Library', 'Application Support', 'Trae');
    configs.cursor = path.join(home, 'Library', 'Application Support', 'Cursor');
  } else if (platform === 'linux') {
    configs.qoder = path.join(home, '.config', 'Qoder');
    configs.trae = path.join(home, '.config', 'Trae');
    configs.cursor = path.join(home, '.config', 'Cursor');
  } else if (platform === 'win32') {
    configs.qoder = path.join(home, 'AppData', 'Roaming', 'Qoder');
    configs.trae = path.join(home, 'AppData', 'Roaming', 'Trae');
    configs.cursor = path.join(home, 'AppData', 'Roaming', 'Cursor');
  }
  
  return configs;
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 复制目录
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 安装到 Qoder
function installQoder(skillName) {
  const configs = getIDEConfigDirs();
  if (!configs.qoder) {
    log.warn('无法确定 Qoder 配置目录');
    return false;
  }
  
  const skillsDir = path.join(configs.qoder, 'skills');
  const srcSkill = path.join(SKILLS_DIR, skillName);
  const destSkill = path.join(skillsDir, skillName);
  
  if (!fs.existsSync(srcSkill)) {
    log.error(`找不到 Skill: ${skillName}`);
    return false;
  }
  
  try {
    ensureDir(skillsDir);
    copyDir(srcSkill, destSkill);
    log.success(`Qoder: ${destSkill}`);
    return true;
  } catch (err) {
    log.error(`Qoder 安装失败: ${err.message}`);
    return false;
  }
}

// 安装到 Trae
function installTrae(skillName) {
  const configs = getIDEConfigDirs();
  if (!configs.trae) {
    log.warn('无法确定 Trae 配置目录');
    return false;
  }
  
  const skillsDir = path.join(configs.trae, 'skills');
  const srcSkill = path.join(SKILLS_DIR, skillName);
  const destSkill = path.join(skillsDir, skillName);
  
  if (!fs.existsSync(srcSkill)) {
    log.error(`找不到 Skill: ${skillName}`);
    return false;
  }
  
  try {
    ensureDir(skillsDir);
    copyDir(srcSkill, destSkill);
    log.success(`Trae: ${destSkill}`);
    return true;
  } catch (err) {
    log.error(`Trae 安装失败: ${err.message}`);
    return false;
  }
}

// 安装到 Cursor
function installCursor(skillName) {
  const configs = getIDEConfigDirs();
  if (!configs.cursor) {
    log.warn('无法确定 Cursor 配置目录');
    return false;
  }
  
  const rulesDir = path.join(configs.cursor, 'rules');
  const srcSkill = path.join(SKILLS_DIR, skillName, 'skill.md');
  const destRule = path.join(rulesDir, `${skillName}.md`);
  
  if (!fs.existsSync(srcSkill)) {
    log.error(`找不到 Skill: ${skillName}`);
    return false;
  }
  
  try {
    ensureDir(rulesDir);
    fs.copyFileSync(srcSkill, destRule);
    log.success(`Cursor: ${destRule}`);
    return true;
  } catch (err) {
    log.error(`Cursor 安装失败: ${err.message}`);
    return false;
  }
}

// 列出可用的 Skills
function listSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    log.error('找不到 Skills 目录');
    return [];
  }
  
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

// 安装指定 Skill 到所有 IDE
function installSkill(skillName, ide = 'all') {
  log.title(`正在安装 Skill: ${skillName}`);
  
  const results = [];
  
  if (ide === 'all' || ide === 'qoder') {
    results.push(installQoder(skillName));
  }
  if (ide === 'all' || ide === 'trae') {
    results.push(installTrae(skillName));
  }
  if (ide === 'all' || ide === 'cursor') {
    results.push(installCursor(skillName));
  }
  
  return results.some(r => r);
}

// 显示帮助
function showHelp() {
  console.log(`
${colors.bold}wenq-skills${colors.reset} - 个人 Skills 集合一键安装工具

${colors.bold}使用方法:${colors.reset}
  npx wenq-skills                    交互式安装
  npx wenq-skills install            安装所有 Skills 到所有 IDE
  npx wenq-skills install <skill>    安装指定 Skill
  npx wenq-skills list               列出所有可用 Skills
  npx wenq-skills help               显示帮助

${colors.bold}选项:${colors.reset}
  --ide <name>    指定 IDE (qoder/trae/cursor/all)

${colors.bold}示例:${colors.reset}
  npx wenq-skills install weekly-report
  npx wenq-skills install weekly-report --ide qoder
  npx wenq-skills list

${colors.bold}可用 Skills:${colors.reset}
${listSkills().map(s => `  - ${s}`).join('\n')}
`);
}

// 交互式安装
async function interactiveInstall() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
  
  console.log(`
${colors.bold}==========================================
  wenq-skills 安装工具
==========================================${colors.reset}
`);
  
  const skills = listSkills();
  if (skills.length === 0) {
    log.error('没有找到可用的 Skills');
    rl.close();
    return;
  }
  
  console.log('可用的 Skills:');
  skills.forEach((s, i) => console.log(`  ${i + 1}) ${s}`));
  console.log(`  ${skills.length + 1}) 安装全部`);
  console.log('  0) 退出\n');
  
  const skillChoice = await question('请选择要安装的 Skill [0-' + (skills.length + 1) + ']: ');
  const skillIndex = parseInt(skillChoice);
  
  if (skillIndex === 0 || isNaN(skillIndex)) {
    console.log('退出安装');
    rl.close();
    return;
  }
  
  console.log('\n目标 IDE:');
  console.log('  1) 所有支持的 IDE');
  console.log('  2) 仅 Qoder');
  console.log('  3) 仅 Trae');
  console.log('  4) 仅 Cursor\n');
  
  const ideChoice = await question('请选择目标 IDE [1-4]: ');
  const ideMap = { '1': 'all', '2': 'qoder', '3': 'trae', '4': 'cursor' };
  const ide = ideMap[ideChoice] || 'all';
  
  if (skillIndex === skills.length + 1) {
    // 安装全部
    for (const skill of skills) {
      installSkill(skill, ide);
    }
  } else if (skillIndex >= 1 && skillIndex <= skills.length) {
    installSkill(skills[skillIndex - 1], ide);
  } else {
    log.error('无效的选择');
  }
  
  console.log(`
${colors.bold}==========================================
  安装完成!
==========================================${colors.reset}

${colors.cyan}使用方法:${colors.reset}
  在 IDE 对话框中输入: /周报 或 /weekly
  然后粘贴你的周工作内容即可
`);
  
  rl.close();
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    case 'list':
    case 'ls':
      log.title('可用的 Skills:');
      listSkills().forEach(s => console.log(`  - ${s}`));
      break;
      
    case 'install':
    case 'add':
      const skillName = args[1];
      const ideIndex = args.indexOf('--ide');
      const ide = ideIndex !== -1 ? args[ideIndex + 1] : 'all';
      
      if (skillName) {
        installSkill(skillName, ide);
      } else {
        // 安装所有
        const skills = listSkills();
        for (const skill of skills) {
          installSkill(skill, ide);
        }
      }
      
      console.log(`\n${colors.green}安装完成！${colors.reset}`);
      console.log(`使用方法: 在 IDE 中输入 /周报 或 /weekly\n`);
      break;
      
    default:
      await interactiveInstall();
  }
}

main().catch(console.error);
