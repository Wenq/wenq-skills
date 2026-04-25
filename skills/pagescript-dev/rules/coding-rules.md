# 编码风格规范

本文档定义页面脚本的编码风格和质量标准。API 使用规范请参考对应的 reference 文件。

## 一、命名约定

- **控件标识**：使用设计器中配置的实际标识（如 `kdtest_textfield`）
- **自定义变量/函数**：驼峰命名（camelCase）
- **常量**：全大写下划线分隔（UPPER_SNAKE_CASE）
- **Render 函数**：大驼峰命名（PascalCase），如 `ProgressRender`、`TreeItemRender`

## 二、事件绑定策略

1. **标准事件优先**：优先使用 `onValueChange`、`onClick` 等标准事件
2. **DOM 事件兜底**：仅在标准事件无法满足时使用 `on` 接口
3. **资源释放**：`willUnmount` 中移除通过 `on` 添加的监听、清除定时器、销毁动态 DOM

## 三、代码组织

1. 事件绑定放在 `didMount` 顶部
2. 数据初始化和条件判断紧随其后
3. DOM 操作和自定义渲染放在最后
4. 辅助函数提取到 `didMount` 外部，需访问 this 时加 `export`

## 四、调试与发布

### 开发阶段
- 用 `console.log` 输出关键变量
- 用 `debugger` 设置断点
- 可开启 `window.show_ps_init = true` 追踪脚本加载

### 发布前必做
- 删除所有 `debugger` 语句
- 移除调试用 `console.log`
- 确认异常已合理捕获（try/catch）

## 五、性能与安全

### 性能
- 避免在事件回调中执行耗时操作
- 合理使用 `setTimeout` / `requestAnimationFrame`
- `loadFiles` 加载的资源注意缓存

### 安全
- 不在脚本中存放敏感信息
- 引用第三方资源需确保安全性
- 脚本在设计器中可被查看，不放置重要业务逻辑
