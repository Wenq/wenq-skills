# 苍穹页面脚本编码规范

## 一、基本规范

### 1.1 生命周期
- 所有业务逻辑写在 `didMount` 函数中
- 资源释放逻辑写在 `willUnmount` 函数中
- 不要在生命周期函数外部使用 `this`（外部 this 指向 window）

### 1.2 this 上下文
- 事件回调、异步回调中**必须使用箭头函数**，确保 this 指向页面脚本上下文
- 独立函数需要 `export` 修饰，调用方式为 `this.函数名()`

### 1.3 命名约定
- 控件标识：使用设计器中配置的实际标识（如 `kdtest_textfield`）
- 自定义变量/函数：使用驼峰命名（camelCase）
- 常量：使用全大写下划线分隔（UPPER_SNAKE_CASE）

## 二、事件绑定规范

### 2.1 标准事件优先
- 优先使用标准事件（onValueChange、onClick、onItemClick 等）
- 仅在标准事件不满足时才使用 DOM 原生事件（on 接口）

### 2.2 DOM 事件注意事项
- `on` 接口监听的事件不与控件内部状态联动
- 带 selector 时 focus → focusin、blur → focusout
- DOM 操作依赖的子元素结构可能在版本升级后变化，谨慎使用

### 2.3 资源释放
- 在 willUnmount 中移除通过 `on` 添加的事件监听
- 清除定时器（clearTimeout / clearInterval）
- 销毁动态创建的 DOM 元素

## 三、数据操作规范

### 3.1 字段赋值
- 文本/数字等基础字段：使用 `setValue`
- 基础资料类型字段：**不可直接使用 setValue**（会引发服务端报错）
- 基础资料字段读值需 `toJS()` 转换

### 3.2 表格数据
- 设置单元格值：`setCellValue([{k, r, v}])`
- 设置样式支持属性：bc(背景色)、fc(前景色)、fs(字体大小)

### 3.3 set 接口限制
- 仅支持样式相关属性（如 Width、Height、Name 等）
- **不支持**修改：锁定性、可见性、必录、控件标识、类型等属性

## 四、自定义渲染规范

### 4.1 React 语法
- 使用 React 16.8 语法（支持 JSX 和 Hooks：useState、useEffect 等）
- Render 函数返回 React 元素（JSX）

### 4.2 setCellRender 注意
- `value` 是格式化后的值（受国际化影响），原始值使用 `originValue`
- 查看态需关注 `isCellLock` 处理锁定视觉效果
- 编辑态不需要处理锁定状态（锁定时不可进入编辑态）

### 4.3 覆盖规则
- 同一控件同一列，子页面脚本覆盖父页面脚本的自定义渲染器

## 五、通信规范

### 5.1 与自定义控件通信
- 页面脚本 → 自定义控件：使用 `invoke` 接口
- 自定义控件 → 页面脚本：使用 `onCustomMsgEvent` + `triggerCustomMsgEvent`

### 5.2 与服务端通信
- 前端使用 `fetchData(methodName, param)` 发送请求
- 服务端通过重载 `customEvent` 接收，固定事件 key 为 `__clientRequest__`
- 服务端通过 `setPageJSData` 全局指令返回数据

## 六、调试规范

### 6.1 开发阶段
- 使用 `console.log` 输出关键变量
- 使用 `debugger` 设置断点
- 可开启 `window.show_ps_init = true` 追踪脚本加载

### 6.2 发布前
- 删除所有 `debugger` 语句
- 移除调试用的 `console.log`
- 确认异常已被合理捕获（try/catch）

## 七、性能与安全

### 7.1 性能
- 避免在事件回调中执行耗时操作
- 合理使用 setTimeout/requestAnimationFrame
- loadFiles 加载的资源注意缓存

### 7.2 安全
- 不在脚本中存放敏感信息
- 引用第三方资源需确保安全性
- 脚本在设计器中可被查看，不放置重要业务逻辑
