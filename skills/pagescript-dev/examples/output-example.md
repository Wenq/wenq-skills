# 输出示例

每个示例标注了**场景标签**、**易错提醒**和对应的**反例参考**。

## 示例1：字段联动（两数求和）
**场景**：字段值变化/联动 → `onValueChange` + `setValue`
**易错提醒**：若字段是基础资料类型，不可使用 setValue（参考 `anti-patterns.md` 第二节）

```javascript
/**
 * 单据初始化函数
 */
function didMount() {
  // 监听整数字段1值变化 → 更新合计
  this.$('kdtest_integerfield1').onValueChange((data) => {
    const val2 = this.$('kdtest_integerfield2').getValue()
    this.$('kdtest_integerfield').setValue(parseInt(data.newValue) + parseInt(val2))
  })

  // 监听整数字段2值变化 → 更新合计
  this.$('kdtest_integerfield2').onValueChange((data) => {
    const val1 = this.$('kdtest_integerfield1').getValue()
    this.$('kdtest_integerfield').setValue(parseInt(data.newValue) + parseInt(val1))
  })
}

function willUnmount() {}
```

> **注意**：parseInt 转换确保数值类型正确，避免字符串拼接。
> **易错提醒**：此处字段为整数类型可用 setValue；若为基础资料类型则禁止使用。

---

## 示例2：下拉选择动态修改文字颜色
**场景**：字段值变化/联动 + 样式修改 → `onValueChange` + DOM 操作
**易错提醒**：DOM 结构可能随版本升级变化（参考 `anti-patterns.md`）

```javascript
/**
 * 单据初始化函数
 */
function didMount() {
  this.$('kdtest_combofield').onValueChange((data) => {
    let colorValue
    switch (data.newValue) {
      case 'red':
        colorValue = 'red'
        break
      case 'yellow':
        colorValue = 'yellow'
        break
      case 'blue':
        colorValue = 'blue'
        break
      default:
        colorValue = 'black'
    }
    const selectEle = this.$('kdtest_combofield').getElement()
    if (selectEle) {
      // kd-cq-combo-selected 是下拉框选中文字的全局样式名
      const inputElement = selectEle.querySelector('.kd-cq-combo-selected')
      if (inputElement) {
        inputElement.style.color = colorValue
      }
    }
  })
}

function willUnmount() {}
```

> **注意**：DOM 查询依赖 `.kd-cq-combo-selected` 样式名，版本升级可能变化。
> **易错提醒**：回调函数必须使用箭头函数（参考 `anti-patterns.md` 第一节）。

---

## 示例3：表格单元格进度条渲染（查看态）
**场景**：表格自定义渲染（查看态）→ `setCellRender`
**易错提醒**：value 是格式化值，数值计算用 originValue（参考 `anti-patterns.md` 第五节）

```javascript
/**
 * 单据初始化函数
 */
function didMount() {
  // 为小数字段列设置自定义渲染器
  this.$('kdtest_entryentity').setCellRender({
    kdtest_decimalfield: progressRender
  })
}

// 进度条渲染器
const progressRender = (props) => {
  const { value } = props
  const progressContainer = {
    width: '100%',
    height: '20px',
    backgroundColor: '#f2f2f2',
    border: '1px solid #ccc',
    position: 'relative'
  }
  const barWidth = value * 100 + '%'
  const progressBar = {
    height: '100%',
    backgroundColor: '#4CAF50',
    width: barWidth
  }
  const progressLabel = {
    position: 'absolute',
    top: 0,
    right: '50%',
    padding: '2px 4px',
    color: '#276ff5'
  }
  return (
    <div style={progressContainer}>
      <div style={progressBar}></div>
      <div style={progressLabel}>{Math.round(value * 100) + '%'}</div>
    </div>
  )
}

function willUnmount() {}
```

>> **注意**：value 为格式化后的值，如需原始值使用 `props.originValue`。
> **易错提醒**：禁止使用文档未列出的 props 属性（参考 `anti-patterns.md` 第五节）。

---

## 示例4：树节点扩展"新增"按钮
**场景**：树节点自定义渲染 → `setTreeItemRender` + `fetchData`
**易错提醒**：Render 函数中 this 不可用，需用 self 变量（参考 `anti-patterns.md` 第一节）

```javascript
let self

/**
 * 单据初始化函数
 */
function didMount() {
  self = this
  // 设置 hover 时显示扩展元素
  this.utils.createStyle(`
    .kd-cq-tree-treenode:hover .treeNodeExt {
      visibility: visible !important;
    }
  `)
  this.$('kdtest_treeviewap').setTreeItemRender(TreeItemRender)
}

/**
 * 树节点自定义渲染函数
 */
function TreeItemRender(props) {
  const { Render, text, style = {}, ...others } = props

  const onLinkClick = (event) => {
    event.preventDefault()
    const nodeId = event.currentTarget.getAttribute('data-treemenuid')
    self.fetchData('treeMenuClick', { treeMenuId: nodeId }).then((data) => {
      self.utils.showMessage('操作成功: ' + nodeId, { type: 0, duration: 2000 })
    })
  }

  const extMenu = (
    <a onClick={onLinkClick} href="true" className="kd-dropdown-link treeNodeExt"
       style={{ width: '100px', display: 'flex', flexGrow: 1, visibility: 'hidden' }}
       data-treeMenuId={props.id}>
      <span style={{ whiteSpace: 'nowrap' }}>新增({props.id})</span>
    </a>
  )

  return <Render {...others} text={text} Slot={extMenu} />
}

function willUnmount() {}
```

> **注意**：自定义渲染使用 React 16.8 语法。树节点渲染器中 this 不指向脚本上下文，需用外部变量 `self` 保存引用。

---

## 示例5：按钮点击与服务端通信
**场景**：按钮点击 + 与服务端通信 → DOM `on('click')` + `fetchData`
**参考**：`rules/communication-reference.md`

**前端页面脚本：**
```javascript
/**
 * 单据初始化函数
 */
function didMount() {
  this.$('kdtest_buttonap1').on('click', (e) => {
    this.fetchData('getUserInfo', { userName: 'xiaoming', userCode: '123' }).then((result) => {
      console.log('服务端返回:', result)
      this.utils.showMessage('获取成功', { type: 0, duration: 3000 })
    })
  })
}

function willUnmount() {}
```

**服务端 KS 脚本：**
```javascript
customEvent(e) {
  const key = e.getKey()
  const eventName = e.getEventName()
  const eventArgs = e.getEventArgs()
  if (key === '__clientRequest__') {
    if (eventName === 'getUserInfo') {
      // 处理业务逻辑...
      this.getView().getClientProxy().addAction('setPageJSData', {
        name: 'userInfo',
        args: { userName: eventArgs.userName, role: 'admin' }
      })
    }
  }
}
```

---

## 示例6：实时大小写转换
**场景**：DOM 事件 → `on('input')` + `setValue`
**易错提醒**：标准 onValueChange 是失焦触发，实时监听需用 DOM 原生 input 事件

```javascript
/**
 * 单据初始化函数
 */
function didMount() {
  // 监听 input 原生事件实现实时转换
  this.$('kdtest_textfield').on('input', 'input', (e) => {
    setTimeout(() => {
      this.$('kdtest_textfield').setValue(e.target.value.toUpperCase())
    }, 100)
  })
}

function willUnmount() {}
```

> **注意**：使用 DOM 原生 `input` 事件实现实时监听（标准 onValueChange 是失去焦点才触发）。setTimeout 让大写转换有动态过程。

---

## 示例7：页面脚本与自定义控件双向通信
**场景**：与自定义控件通信 → `invoke` + `onCustomMsgEvent`
**参考**：`rules/communication-reference.md`

```javascript
/**
 * 单据初始化函数
 */
function didMount() {
  // 页面脚本 → 自定义控件：字段值变化时发送消息
  this.$('kdtest_textfield').onValueChange((data) => {
    this.$('customcontrolap').invoke('textFieldValueChange', { data: data.newValue })
  })

  // 自定义控件 → 页面脚本：接收消息
  this.$('customcontrolap').onCustomMsgEvent((data) => {
    if (data.args && data.args.type === '__init__') {
      console.log('自定义控件初始化完成')
      // 可在此执行与自定义控件相关的初始化逻辑
    } else {
      console.log('收到自定义控件消息:', data)
    }
  })
}

function willUnmount() {}
```

> **注意**：自定义控件内部需在 `handleDirective` 中处理 invoke 消息，通过 `this.model.triggerCustomMsgEvent` 向页面脚本发送消息。
> **易错提醒**：回调函数必须使用箭头函数保证 this 指向（参考 `anti-patterns.md` 第一节）。
