# 苍穹页面脚本代码模板

每个模板标注了**场景标签**，与 SKILL.md 中的需求路由决策树对应。

## 基础模板
**场景**：所有场景的起始结构

```javascript
/**
 * 单据初始化函数
 * 在单据加载服务端插件后、业务数据加载完成后自动调用
 */
function didMount() {
  // 在此编写业务逻辑
}

/**
 * 单据卸载函数
 * 在单据关闭(销毁)时自动调用
 */
function willUnmount() {
  // 资源释放
}
```

## 字段值监听模板
**场景**：字段值变化/联动 → `onValueChange`

```javascript
function didMount() {
  this.$('字段标识').onValueChange((data) => {
    const { key, newValue, oldValue } = data
    // 处理值变化逻辑
  })
}
```

## 按钮点击模板
**场景**：按钮点击 → `onClick`

```javascript
function didMount() {
  this.$('按钮标识').onClick((data) => {
    // 处理点击逻辑
  })
}
```

## 工具栏点击模板
**场景**：工具栏/页签操作 → `onItemClick`

```javascript
function didMount() {
  this.$('工具栏标识').onItemClick((data) => {
    // data 包含按钮标识和操作代码
  })
}
```

## 字段联动模板
**场景**：字段值变化/联动 → `onValueChange` + `setValue`

```javascript
function didMount() {
  // 字段A值变化 → 影响字段B
  this.$('fieldA').onValueChange((data) => {
    const result = processValue(data.newValue)
    this.$('fieldB').setValue(result)
  })
}

function processValue(value) {
  // 数据转换逻辑
  return value
}
```

## 样式修改模板
**场景**：样式修改 → `css()` / `createStyle`

```javascript
function didMount() {
  // 方式1：css 接口修改内联样式
  this.$('控件标识').css({'background': 'red', 'color': '#666'})

  // 方式2：createStyle 创建 class 样式（作用域为当前单据页面）
  this.utils.createStyle('.custom-class { font-size: 16px; color: blue; }')
}
```

## 表格单元格自定义渲染模板（查看态）
**场景**：表格自定义渲染（查看态）→ `setCellRender`
**参考**：`rules/render-reference.md`

```javascript
function didMount() {
  this.$('表格标识').setCellRender({
    列标识: customCellRender
  })
}

const customCellRender = (props) => {
  const { value, originValue, rowIndex, record, renderProps, Render, isCellLock } = props
  return (
    <div style={{display:'flex', alignItems:'center'}}>
      <span>{value}</span>
    </div>
  )
}
```

## 表格单元格自定义渲染模板（编辑态）
**场景**：表格自定义渲染（编辑态）→ `setCellEditor`
**参考**：`rules/render-reference.md`

```javascript
function didMount() {
  this.$('表格标识').setCellEditor({
    列标识: customCellEditor
  })
}

const customCellEditor = (props) => {
  const { value, updateEditValue, Editor, renderProps, rowIndex } = props
  const [val, setVal] = useState(value)

  const onChange = (e) => {
    const newVal = e.target.value
    setVal(newVal)
    updateEditValue(newVal)
  }

  return (
    <input value={val} onChange={onChange} style={{width:'100%', height:'100%'}} />
  )
}
```

## 树节点自定义渲染模板
**场景**：树节点自定义渲染 → `setTreeItemRender`
**参考**：`rules/render-reference.md`

```javascript
let self

function didMount() {
  self = this
  this.utils.createStyle(`
    .kd-cq-tree-treenode:hover .treeNodeExt {
      visibility: visible !important;
    }
  `)
  this.$('树控件标识').setTreeItemRender(TreeItemRender)
}

function TreeItemRender(props) {
  const { Render, text, style = {}, ...others } = props
  const onClick = (event) => {
    event.preventDefault()
    // 自定义逻辑（需用 self 访问脚本上下文）
  }
  const extElement = (
    <span onClick={onClick} className="treeNodeExt"
          style={{visibility:'hidden', cursor:'pointer'}}>
      操作
    </span>
  )
  return <Render {...others} text={text} Slot={extElement} />
}
```

## 服务端通信模板
**场景**：与服务端通信 → `fetchData`
**参考**：`rules/communication-reference.md`

**前端脚本：**
```javascript
function didMount() {
  this.fetchData('methodName', {param1: 'value1'}).then((result) => {
    console.log(result)
  })
}
```

**服务端 KS 脚本：**
```javascript
customEvent(e) {
  const key = e.getKey()
  const eventName = e.getEventName()
  const eventArgs = e.getEventArgs()
  if (key === '__clientRequest__') {
    if (eventName === 'methodName') {
      this.getView().getClientProxy().addAction('setPageJSData', {
        name: 'resultKey',
        args: { /* 返回数据 */ }
      })
    }
  }
}
```

## 自定义控件通信模板
**场景**：与自定义控件通信 → `invoke` + `onCustomMsgEvent`
**参考**：`rules/communication-reference.md`

```javascript
function didMount() {
  // 向自定义控件发送消息
  this.$('字段标识').onValueChange((data) => {
    this.$('自定义控件标识').invoke('methodName', {data: data.newValue})
  })

  // 接收自定义控件消息
  this.$('自定义控件标识').onCustomMsgEvent((data) => {
    if (data.args.type === '__init__') {
      // 自定义控件初始化完成
    }
  })
}
```

## 加载第三方资源模板
**场景**：加载第三方资源 → `loadFiles`

```javascript
function didMount() {
  this.utils.loadFiles([
    'https://cdn.example.com/lib.js',
    'https://cdn.example.com/style.css'
  ]).then((result) => {
    console.log('资源已加载', result)
  })
}

function willUnmount() {
  // 清理第三方资源相关的引用
}
```

## 根据单据状态控制逻辑模板
**场景**：条件判断 → `getFormStatus`

```javascript
function didMount() {
  const status = this.getFormStatus()
  // 0-新增、1-修改、2-查看、4-提交、5-审核
  if (status === 2) {
    // 查看态逻辑
  } else if (status === 0 || status === 1) {
    // 编辑态逻辑
  }
}
```
