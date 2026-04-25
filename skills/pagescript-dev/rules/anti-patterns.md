# 常见错误与反例

本文档与 SKILL.md 阶段三「输出验证 checklist」对照使用。每个错误标注了触发的检查项。

## 一、this 指向丢失
> 触发检查项：「this 指向检查」

### 错误：回调中使用 function 关键字
```javascript
// ❌ 错误 — function 会丢失 this 指向
this.$('btn').on('click', function(e) {
  this.$('field').setValue('x')  // 报错！this 指向 window
})

// ✅ 正确 — 箭头函数自动绑定 this
this.$('btn').on('click', (e) => {
  this.$('field').setValue('x')
})
```

### 错误：Render 函数中直接使用 this
```javascript
// ❌ 错误 — Render 函数中 this 不指向脚本上下文
function TreeItemRender(props) {
  this.fetchData('xxx', {})  // 报错！
}

// ✅ 正确 — 用外部变量保存引用
let self
function didMount() {
  self = this
  this.$('tree').setTreeItemRender(TreeItemRender)
}
function TreeItemRender(props) {
  self.fetchData('xxx', {})  // 正确
}
```

## 二、基础资料字段操作错误
> 触发检查项：「数据类型检查」

### 错误：对基础资料字段使用 setValue
```javascript
// ❌ 错误 — 会引发服务端报错
this.$('basedatafield').setValue({ id: '123', name: 'test' })

// ✅ 正确 — 基础资料字段不可通过 setValue 赋值
// 建议通过服务端插件处理赋值，或使用其他机制
```

### 错误：getValue 未做 toJS 转换
```javascript
// ❌ 错误 — 基础资料 getValue 返回不可变对象
const val = this.$('basedatafield').getValue()
console.log(val.id)  // 可能报错或返回 undefined

// ✅ 正确 — 需要 toJS() 转换
let val = this.$('basedatafield').getValue()
if (val && val.toJS) {
  val = val.toJS()
}
console.log(val.id)  // 正确
```

## 三、猜测不存在的 API
> 触发检查项：「API 合规检查」

### 错误：类推其他框架的接口
```javascript
// ❌ 以下接口均不存在！禁止使用！
this.$('field').setEditable(false)      // 不存在
this.$('field').setVisible(false)       // 不存在
this.$('field').setRequired(true)       // 不存在
this.$('field').disable()               // 不存在
this.$('field').hide()                  // 不存在
this.$('field').show()                  // 不存在
this.$('field').enable()                // 不存在
this.$('field').trigger('click')        // 不存在
this.$('table').addRow({})              // 不存在
this.$('table').deleteRow(0)            // 不存在
this.$('table').setColumnVisible(false) // 不存在

// ✅ 正确 — set 接口仅支持样式属性
this.$('field').set('Width', '200px')   // 仅样式属性
// 锁定性/可见性/必录等需通过设计器或服务端配置
```

## 四、事件使用错误
> 触发检查项：「API 合规检查」+「DOM 安全检查」

### 错误：使用不存在的事件
```javascript
// ❌ 以下事件均不存在！
this.$('field').onChange(callback)       // 不存在，应使用 onValueChange
this.$('field').onBlur(callback)        // 不存在
this.$('field').onFocus(callback)       // 不存在
this.$('table').onRowSelect(callback)   // 不存在，应使用 onSelect
this.$('btn').onDoubleClick(callback)   // 不存在

// ✅ 正确 — 使用文档列出的标准事件
this.$('field').onValueChange(callback)
this.$('table').onSelect(callback)
this.$('btn').onClick(callback)
```

### 错误：focus/blur 带 selector 不替换
```javascript
// ❌ 带 selector 时 focus/blur 不生效
this.$('标识').on('focus', 'input', handler)
this.$('标识').on('blur', 'input', handler)

// ✅ 必须替换为 focusin/focusout
this.$('标识').on('focusin', 'input', handler)
this.$('标识').on('focusout', 'input', handler)
```

## 五、自定义渲染错误
> 触发检查项：「API 合规检查」+「数据类型检查」

### 错误：使用未列出的 props 属性
```javascript
// ❌ 假设存在未文档化的属性
const cellRender = (props) => {
  const { value, columnKey, isEditing, cellWidth } = props  // columnKey/isEditing/cellWidth 不存在！
}

// ✅ 只使用文档列出的属性
const cellRender = (props) => {
  const { value, originValue, rowIndex, record, renderProps, Render, parentElement, isCellLock } = props
}
```

### 错误：混淆 value 和 originValue
```javascript
// ❌ 用格式化后的 value 做数值计算
const cellRender = (props) => {
  if (props.value > 100) { ... }  // value 可能是格式化后的字符串！
}

// ✅ 数值计算用 originValue
const cellRender = (props) => {
  if (props.originValue > 100) { ... }
}
```

## 六、超出能力范围时的错误处理
> 触发检查项：「阶段一 Gate 1 能力边界检查」

### 错误：猜测实现
```javascript
// ❌ 用户要求"隐藏某个字段" → 猜测接口
this.$('field').setVisible(false)  // 不存在！

// ✅ 正确响应
// "当前页面脚本不支持直接控制字段可见性，
//  建议通过设计器的可见性规则配置，或通过服务端插件实现"
```
