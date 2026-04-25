---
name: pagescript-dev
description: 苍穹低代码前端页面脚本开发助手。根据用户描述的业务需求，生成符合苍穹页面脚本规范的JavaScript代码。支持生命周期、事件绑定、API调用、表格/树自定义渲染、服务端通信等场景。当用户提到"页面脚本"、"pagescript"、"苍穹脚本"、"低代码脚本"时使用此技能。
---

# 苍穹低代码页面脚本开发助手

根据用户描述的业务需求，生成符合苍穹前端页面脚本规范的 JavaScript 代码。

## 功能说明

- 根据业务需求生成苍穹页面脚本代码
- 支持所有内置 API（控件方法、字段方法、表单方法、DOM操作、工具类）
- 支持所有标准事件（字段值改变、按钮点击、工具栏点击、表格事件、树事件等）
- 支持表格单元格自定义渲染（查看态 setCellRender / 编辑态 setCellEditor）
- 支持树节点自定义渲染（setTreeItemRender）
- 支持页面脚本与自定义控件通信（invoke / onCustomMsgEvent）
- 支持页面脚本与服务端插件通信（fetchData / customEvent）
- 提供调试建议与常见问题解决方案

## 使用方法

1. 用户描述业务需求（如"监听字段值变化并修改样式"）
2. 分析需求对应的 API / 事件 / 渲染接口
3. 生成完整可用的页面脚本代码
4. 给出关键注意事项和调试建议

## 适用场景

1. 在前端页面快速实现简单的业务控制逻辑
2. 依据页面数据状态对 UI 元素做定制开发（样式、内容、动画等）
3. 自定义控件渲染数据依赖页面字段数据变化
4. 表格单元格、树节点的自定义渲染或扩展
5. 前端页面与服务端插件的数据通信
6. 其他基于 web 页面轻量化 JS 脚本想实现的功能

## 核心知识体系

### 一、脚本生命周期

页面脚本在两个生命周期函数中编写：

#### didMount
- **作用**：单据初始化函数
- **时机**：在单据加载服务端插件后、业务数据加载完成后（loaddata 请求后）自动调用
- **用途**：注册组件事件监听、设置数据、执行 DOM 操作等
- **重要**：一般脚本代码的主要实现逻辑都建议在该函数中编写

```javascript
function didMount() {
  // 主要逻辑在这里编写
}
```

#### willUnmount
- **作用**：单据卸载函数
- **时机**：在单据关闭（销毁）时自动调用
- **用途**：移除 DOM 事件监听/定时器、销毁 UI 元素、删除全局变量等

```javascript
function willUnmount() {
  // 资源释放逻辑
}
```

### 二、内置对象

#### this — 页面脚本上下文
- 在 didMount 或 willUnmount 中访问
- 嵌套函数中**必须使用箭头函数**保证 this 指向正确

```javascript
function didMount() {
  // 正确 — 箭头函数自动绑定 this
  this.$('控件标识').on('click', (e) => {
    this.$('控件标识').set('Name', 'title')
  })
  
  // 错误 — function 关键字会丢失 this
  this.$('控件标识').on('click', function(e) {
    this.$('控件标识').set('Name', 'title') // 报错！
  })
}
```

#### this.$('控件标识') — 获取控件实例
- 获取控件实例后可调用控件相关功能接口

#### export 关键字
- 独立函数中需要访问 this 等内置对象时，用 export 修饰
- 调用方式：`this.独立函数名称()`

```javascript
function didMount() {
  this.testMethod()
}

export function testMethod() {
  this.$('控件标识').setValue('111')
}
```

### 三、API 参考

#### 3.1 通用控件方法

| API | 说明 | 格式 |
|-----|------|------|
| set | 设置控件属性值 | `this.$('标识').set('属性名', '属性值')` |
| get | 获取控件属性值 | `this.$('标识').get('属性名')` |
| isEditable | 获取控件是否可编辑 | `this.$('标识').isEditable()` |
| isVisible | 获取控件是否可见 | `this.$('标识').isVisible()` |

#### 3.2 字段方法

| API | 说明 | 格式 |
|-----|------|------|
| setValue | 设置字段值 | `this.$('标识').setValue('值')` |
| getValue | 获取字段值 | `this.$('标识').getValue()` |
| isRequired | 获取字段必录属性 | `this.$('标识').isRequired()` |

**注意**：基础资料和多语言类型字段通过 getValue 获取的是不可变对象，需用 `.toJS()` 转换：
```javascript
let val = this.$('basedatafield').getValue()
if (val && val.toJS) {
  val = val.toJS()
}
```

#### 3.3 表单方法

| API | 说明 | 格式 |
|-----|------|------|
| getFormConfig | 获取表单配置信息 | `this.getFormConfig()` |
| getFormMeta | 获取表单元数据 | `this.getFormMeta()` |
| getFormStatus | 获取单据状态（0新增/1修改/2查看/4提交/5审核） | `this.getFormStatus()` |
| fetchData | 获取服务端数据 | `this.fetchData(methodName, param).then(result => {})` |

#### 3.4 DOM 操作方法

| API | 说明 | 格式 |
|-----|------|------|
| on | 添加 DOM 事件监听 | `this.$('标识').on('事件名', [selector], callback)` |
| off | 移除 DOM 事件监听 | `this.$('标识').off('事件名', callback)` |
| getElement | 获取控件 DOM 对象 | `this.$('标识').getElement()` |
| wait | 异步获取懒加载控件 DOM | `this.$('标识').wait().then(dom => {})` |
| css | 设置控件内联样式 | `this.$('标识').css({'属性': '值'})` |

**重要**：focus/blur 事件在带 selector 时需替换为 focusin/focusout：
```javascript
this.$('标识').on('focusin', 'input', handler)  // 正确
this.$('标识').on('focus', 'input', handler)     // 不生效
```

#### 3.5 工具类函数

| API | 说明 | 格式 |
|-----|------|------|
| loadFiles | 加载第三方资源文件 | `this.utils.loadFiles(['url1','url2']).then(r => {})` |
| showMessage | 显示消息提示 | `this.utils.showMessage('内容', {type:0, duration:3000})` |
| createStyle | 创建页面样式 | `this.utils.createStyle('css内容')` |
| loadArtTemplate | 加载 art 模板库 | `this.utils.loadArtTemplate().then(template => {})` |

showMessage 的 type 参数：0-成功、1-错误、2-警告

### 四、标准事件

#### 4.1 字段事件

**onValueChange** — 字段值更改事件（失去焦点时触发）
```javascript
// data: {key, newValue, oldValue}
this.$('字段标识').onValueChange((data) => {
  // 业务逻辑
})
```

#### 4.2 按钮事件

**onClick** — 按钮单击事件（按钮锁定时不触发）
```javascript
this.$('按钮标识').onClick((data) => {
  // data 包含控件标识和绑定的操作代码
})
```

#### 4.3 工具栏 / 高级面板工具栏 / 页签操作

**onItemClick** — 工具栏按钮单击事件
```javascript
this.$('工具栏标识').onItemClick((data) => {
  // data 包含按钮标识和操作代码
})
```

#### 4.4 自定义控件事件

**onCustomMsgEvent** — 自定义消息订阅
```javascript
// data: {type, args} — 内容由自定义控件内部定义
this.$('自定义控件标识').onCustomMsgEvent((data) => {
  if (data.args.type === '__init__') {
    // 自定义控件初始化完成
  }
})
```

#### 4.5 树控件事件

| 事件 | 说明 |
|------|------|
| onInit | 控件初始化完成（返回 Promise） |
| onTreeNodeClick | 节点单击 |
| onTreeNodeDoubleClick | 节点双击 |
| onTreeNodeCheck | 节点勾选/取消勾选 |

```javascript
this.$('树控件标识').onInit().then(() => { /* 树加载完成 */ })
this.$('树控件标识').onTreeNodeClick((data) => { })
```

#### 4.6 表格事件

| 事件 | 说明 |
|------|------|
| onInit | 控件初始化完成（返回 Promise） |
| onTableRowClick | 行单击 |
| onTableRowDoubleClick | 行双击 |
| onCellValueChange | 单元格值改变 |
| onSelect / onUnSelect | 勾选/取消勾选 |
| onSelectAll / onUnSelectAll | 全选/取消全选 |

```javascript
this.$('表格标识').onInit().then(() => { /* 表格加载完成 */ })
this.$('表格标识').onTableRowClick((data) => { })
this.$('表格标识').onCellValueChange((data) => { })
```

### 五、表格功能接口

| 接口 | 说明 | 格式 |
|------|------|------|
| setCellValue | 设置单元格值 | `this.$('表格标识').setCellValue([{k:'列标识', r:行号, v:值}])` |
| setCellStyle | 设置单元格样式 | `this.$('表格标识').setCellStyle([{k:'列标识', r:行号, s:{bc:'#ff0000'}}])` |
| setRowStyle | 设置行样式 | `this.$('表格标识').setRowStyle([{r:[行号], s:{bc:'#ff0000'}}])` |
| setSelectRows | 设置勾选行 | `this.$('表格标识').setSelectRows([1,3,5])` |
| getRowData | 获取行数据 | `this.$('表格标识').getRowData(行号)` |
| getGridData | 获取所有数据 | `this.$('表格标识').getGridData()` |
| getGridState | 获取选中行状态 | `this.$('表格标识').getGridState()` |
| getFocusedCell | 获取焦点单元格 | `this.$('表格标识').getFocusedCell()` |

### 六、树控件功能接口

| 接口 | 说明 | 格式 |
|------|------|------|
| expand | 展开节点 | `this.$('树标识').expand(节点id)` |
| collapse | 折叠节点 | `this.$('树标识').collapse(节点id)` |
| checkNodes | 勾选节点 | `this.$('树标识').checkNodes(['id1','id2'])` |
| uncheckNodes | 取消勾选 | `this.$('树标识').uncheckNodes(['id1','id2'])` |
| getParent | 获取父节点 | `this.$('树标识').getParent(节点id)` |
| getAllParent | 获取所有父节点 | `this.$('树标识').getAllParent(节点id)` |
| getNode | 获取节点数据 | `this.$('树标识').getNode(节点id)` |
| getTreeData | 获取所有数据 | `this.$('树标识').getTreeData()` |
| getTreeState | 获取树状态 | `this.$('树标识').getTreeState()` |

### 七、自定义渲染

#### 7.1 表格单元格自定义渲染（查看态）

**setCellRender** — 自定义渲染查看态单元格

```javascript
// 方式1：渲染所有单元格
this.$('表格标识').setCellRender(CustomCellRender)

// 方式2：按列渲染
this.$('表格标识').setCellRender({
  列id1: Render函数1,
  列id2: Render函数2
})
```

Render 函数参数 props 包含：
- `value` — 格式化后的值（非原始值，受国际化影响）
- `originValue` — 原始真实数值
- `rowIndex` — 行号
- `record` — 行数据
- `renderProps` — 渲染属性
- `Render` — 默认渲染器（用于扩展而非完全替换）
- `parentElement` — 父元素 DOM
- `isCellLock` — 单元格是否锁定

**重要**：value 是格式化后的值，原始值请使用 originValue。

示例 — 进度条渲染：
```javascript
function didMount() {
  this.$('entryentity').setCellRender({
    kdtest_decimalfield: progressRender
  })
}

const progressRender = (props) => {
  const { value } = props
  const barWidth = value * 100 + '%'
  return (
    <div style={{width:'100%', height:'20px', backgroundColor:'#f2f2f2', border:'1px solid #ccc', position:'relative'}}>
      <div style={{height:'100%', backgroundColor:'#4CAF50', width: barWidth}}></div>
      <div style={{position:'absolute', top:0, right:'50%', padding:'2px 4px', color:'#276ff5'}}>
        {Math.round(value * 100) + '%'}
      </div>
    </div>
  )
}
```

#### 7.2 表格单元格自定义渲染（编辑态）

**setCellEditor** — 自定义渲染编辑态单元格

```javascript
this.$('表格标识').setCellEditor({
  列id1: EditorRender函数1
})
```

Editor Render 函数参数 props 包含：
- `value` — 当前值
- `updateEditValue` — 更新编辑值的回调函数
- `Editor` — 默认编辑器
- `getContainerEle` — 获取容器 DOM

**注意**：用户二开接管编辑态后，编辑完成需通过 updateValue 请求同步数据回服务端。

#### 7.3 树节点自定义渲染

**setTreeItemRender** — 自定义渲染树节点

```javascript
this.$('树控件标识').setTreeItemRender(TreeItemRender)
```

Render 函数参数 props 包含：
- `Render` — 默认渲染器
- `text` — 节点名称
- `id` — 节点 id
- `style` — 样式

示例 — 树节点扩展按钮：
```javascript
let self
function didMount() {
  self = this
  this.utils.createStyle(`
    .kd-cq-tree-treenode:hover .treeNodeExt {
      visibility: visible !important;
    }
  `)
  this.$('treeviewap').setTreeItemRender(TreeItemRender)
}

function TreeItemRender(props) {
  const { Render, text, style = {}, ...others } = props
  const onLinkClick = (event) => {
    event.preventDefault()
    const nodeId = event.currentTarget.getAttribute('data-treemenuid')
    self.fetchData('treeMenuClick', { treeMenuId: nodeId }).then((data) => {
      console.log('clicked:', nodeId)
    })
  }
  const extMenu = (
    <a onClick={onLinkClick} href="true" className="treeNodeExt"
       style={{width:'100px', display:'flex', flexGrow:1, visibility:'hidden'}}
       data-treeMenuId={props.id}>
      <span style={{whiteSpace:'nowrap'}}>新增({props.id})</span>
    </a>
  )
  return <Render {...others} text={text} Slot={extMenu} />
}
```

**渲染器覆盖规则**：同一控件，子页面脚本覆盖父页面脚本的自定义渲染器。
**React 版本**：目前支持 React 16.8。

### 八、与自定义控件通信

#### 页面脚本 → 自定义控件（invoke）
```javascript
this.$('字段标识').onValueChange((data) => {
  this.$('customcontrolap').invoke('methodName', {data: data.newValue})
})
```
自定义控件内部通过 `handleDirective` 方法接收。

#### 自定义控件 → 页面脚本（triggerCustomMsgEvent）
```javascript
// 页面脚本监听
this.$('customcontrolAp').onCustomMsgEvent((data) => {
  // data 包含自定义控件发出的信息
})
```
自定义控件内部调用：
```javascript
this.model.triggerCustomMsgEvent('dataChange', {name: '名称1', code: '888'})
```

### 九、与服务端插件通信（fetchData）

```javascript
// 前端：发送请求
this.fetchData('getUserInfo', {userName:'xiaoming', userCode:'123'}).then((result) => {
  // 处理返回数据
})
```

服务端插件（KS脚本示例）：
```javascript
// 重写 customEvent
customEvent(e) {
  const key = e.getKey()
  const eventName = e.getEventName()
  const eventArgs = e.getEventArgs()
  if (key === '__clientRequest__') {
    if (eventName === 'getUserInfo') {
      this.getView().getClientProxy().addAction('setPageJSData', {name:'test01', args:{a1:'222'}})
    }
  }
}
```

### 十、调试与异常处理

#### 调试方式
1. **debugger 断点**：在脚本中写 `debugger`，打开浏览器控制台即可命中
2. **console.log**：输出日志，点击日志右侧链接可定位脚本文件并打断点
3. **show_ps_init**：通过 `window.show_ps_init = true` 开启，脚本初始化时输出固定 log

#### 异常处理
- 内置 API 调用（如控件标识不存在、接口不存在）有默认异常捕获，后续脚本继续执行
- 用户自编写脚本异常且未捕获时，后续脚本执行会终止

## 代码生成规则

### 必须遵循
1. **所有主要逻辑写在 didMount 中**
2. **回调函数必须使用箭头函数**保证 this 指向正确
3. **独立函数需要 export 修饰**才能访问 this 等内置对象
4. **基础资料字段 getValue 结果需 toJS() 转换**
5. **setCellRender 的 value 是格式化值**，原始值用 originValue
6. **focus/blur 在带 selector 时替换为 focusin/focusout**
7. **createStyle 样式作用域限定在当前单据页面**
8. **set 接口一般只支持样式相关属性**，锁定性/可见性/必录等不可通过脚本修改
9. **setValue 不可用于基础资料类型字段赋值**（会引发服务端报错）
10. **DOM 操作谨慎使用**，版本迭代可能改变 DOM 结构
11. **自定义渲染使用 React 16.8 语法**（支持 JSX 和 Hooks）

### 代码结构模板
```javascript
/**
 * 单据初始化函数
 */
function didMount() {
  // 1. 事件绑定
  // 2. 数据初始化
  // 3. DOM 操作 / 自定义渲染
}

/**
 * 单据卸载函数
 */
function willUnmount() {
  // 资源释放
}
```

### 输出规范
1. 生成的代码直接可粘贴到苍穹页面脚本编辑器中使用
2. 代码中的控件标识用实际标识（用户提供）或注释占位符标明
3. 必须包含完整的 didMount 函数包裹
4. 涉及资源清理的必须包含 willUnmount
5. 提供关键注释说明
6. 如涉及服务端通信，同时给出前端脚本和服务端插件示例代码

## 注意事项

1. 脚本在设计器中编辑或查看，不建议将重要或复杂的业务逻辑放在脚本中实现
2. 如需开发独立控件且需与服务端通信并可复用，推荐使用自定义控件
3. 一个单据页面只有一份 JS 脚本，支持通过继承/扩展/复制继承父页面脚本
4. 多份脚本执行顺序：自顶向下，优先执行父页面脚本
5. on 接口监听的 DOM 事件不与组件内部状态联动（如锁定按钮的 click 仍会触发）
6. 历史单据新增页面脚本后，需做一次设计器保存，否则脚本内容会丢失
7. 脚本发布上线前建议删除 debugger 调试代码
