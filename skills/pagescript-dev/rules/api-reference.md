# API 参考手册

本文档列出页面脚本所有可用 API。**未在此列出的接口一律不可使用。**

## 一、通用控件方法

| API | 说明 | 格式 |
|-----|------|------|
| set | 设置控件属性值（仅样式相关） | `this.$('标识').set('属性名', '属性值')` |
| get | 获取控件属性值 | `this.$('标识').get('属性名')` |
| isEditable | 获取控件是否可编辑 | `this.$('标识').isEditable()` |
| isVisible | 获取控件是否可见 | `this.$('标识').isVisible()` |

> **set 接口限制**：仅支持样式相关属性（Width、Height、Name 等），**不支持**修改锁定性、可见性、必录、控件标识、类型等属性。

## 二、字段方法

| API | 说明 | 格式 |
|-----|------|------|
| setValue | 设置字段值 | `this.$('标识').setValue('值')` |
| getValue | 获取字段值 | `this.$('标识').getValue()` |
| isRequired | 获取字段必录属性 | `this.$('标识').isRequired()` |

**基础资料/多语言字段 getValue 返回不可变对象**，必须用 `.toJS()` 转换：
```javascript
let val = this.$('basedatafield').getValue()
if (val && val.toJS) {
  val = val.toJS()
}
```

**setValue 不可用于基础资料类型字段**（会引发服务端报错）。

## 三、表单方法

| API | 说明 | 格式 |
|-----|------|------|
| getFormConfig | 获取表单配置信息 | `this.getFormConfig()` |
| getFormMeta | 获取表单元数据 | `this.getFormMeta()` |
| getFormStatus | 获取单据状态 | `this.getFormStatus()` |
| fetchData | 获取服务端数据 | `this.fetchData(methodName, param).then(result => {})` |

getFormStatus 返回值：0-新增、1-修改、2-查看、4-提交、5-审核

## 四、DOM 操作方法

| API | 说明 | 格式 |
|-----|------|------|
| on | 添加 DOM 事件监听 | `this.$('标识').on('事件名', [selector], callback)` |
| off | 移除 DOM 事件监听 | `this.$('标识').off('事件名', callback)` |
| getElement | 获取控件 DOM 对象 | `this.$('标识').getElement()` |
| wait | 异步获取懒加载控件 DOM | `this.$('标识').wait().then(dom => {})` |
| css | 设置控件内联样式 | `this.$('标识').css({'属性': '值'})` |

**focus/blur 带 selector 时必须替换**：
```javascript
this.$('标识').on('focusin', 'input', handler)  // ✅ 正确
this.$('标识').on('focus', 'input', handler)     // ❌ 不生效
```

## 五、工具类函数

| API | 说明 | 格式 |
|-----|------|------|
| loadFiles | 加载第三方资源 | `this.utils.loadFiles(['url1','url2']).then(r => {})` |
| showMessage | 显示消息提示 | `this.utils.showMessage('内容', {type:0, duration:3000})` |
| createStyle | 创建页面样式 | `this.utils.createStyle('css内容')` |
| loadArtTemplate | 加载 art 模板库 | `this.utils.loadArtTemplate().then(template => {})` |

showMessage 的 type 参数：0-成功、1-错误、2-警告

## 六、表格功能接口

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

样式属性缩写：bc(背景色)、fc(前景色)、fs(字体大小)

## 七、树控件功能接口

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

## 八、调试方法

1. **debugger 断点**：脚本中写 `debugger`，打开浏览器控制台命中
2. **console.log**：输出日志，点击右侧链接可定位脚本文件
3. **show_ps_init**：`window.show_ps_init = true` 开启脚本初始化日志

**异常处理**：
- 内置 API 调用异常有默认捕获，后续脚本继续执行
- 用户脚本异常未捕获时，后续脚本会终止
