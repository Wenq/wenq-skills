# 标准事件参考

本文档列出页面脚本所有可用事件。**未在此列出的事件一律不可使用。**

## 一、字段事件

### onValueChange — 字段值更改事件
- **触发时机**：字段失去焦点时
- **回调参数**：`{key, newValue, oldValue}`

```javascript
this.$('字段标识').onValueChange((data) => {
  const { key, newValue, oldValue } = data
  // 业务逻辑
})
```

## 二、按钮事件

### onClick — 按钮单击事件
- **触发时机**：按钮被点击（按钮锁定时不触发）
- **回调参数**：包含控件标识和绑定的操作代码

```javascript
this.$('按钮标识').onClick((data) => {
  // 处理点击逻辑
})
```

## 三、工具栏事件

### onItemClick — 工具栏按钮单击事件
- **适用范围**：工具栏 / 高级面板工具栏 / 页签操作
- **回调参数**：包含按钮标识和操作代码

```javascript
this.$('工具栏标识').onItemClick((data) => {
  // 处理工具栏按钮点击
})
```

## 四、自定义控件事件

### onCustomMsgEvent — 自定义消息订阅
- **回调参数**：`{type, args}` — 内容由自定义控件内部定义
- **典型用法**：监听自定义控件初始化完成（`data.args.type === '__init__'`）

```javascript
this.$('自定义控件标识').onCustomMsgEvent((data) => {
  if (data.args.type === '__init__') {
    // 自定义控件初始化完成
  }
})
```

## 五、树控件事件

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| onInit | 控件初始化完成 | 返回 Promise |
| onTreeNodeClick | 节点单击 | 节点数据 |
| onTreeNodeDoubleClick | 节点双击 | 节点数据 |
| onTreeNodeCheck | 节点勾选/取消勾选 | 勾选状态数据 |

```javascript
this.$('树控件标识').onInit().then(() => { /* 树加载完成 */ })
this.$('树控件标识').onTreeNodeClick((data) => { })
this.$('树控件标识').onTreeNodeDoubleClick((data) => { })
this.$('树控件标识').onTreeNodeCheck((data) => { })
```

## 六、表格事件

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| onInit | 控件初始化完成 | 返回 Promise |
| onTableRowClick | 行单击 | 行数据 |
| onTableRowDoubleClick | 行双击 | 行数据 |
| onCellValueChange | 单元格值改变 | 单元格数据 |
| onSelect | 勾选行 | 勾选数据 |
| onUnSelect | 取消勾选行 | 取消勾选数据 |
| onSelectAll | 全选 | 全选数据 |
| onUnSelectAll | 取消全选 | 取消全选数据 |

```javascript
this.$('表格标识').onInit().then(() => { /* 表格加载完成 */ })
this.$('表格标识').onTableRowClick((data) => { })
this.$('表格标识').onTableRowDoubleClick((data) => { })
this.$('表格标识').onCellValueChange((data) => { })
this.$('表格标识').onSelect((data) => { })
this.$('表格标识').onUnSelect((data) => { })
this.$('表格标识').onSelectAll((data) => { })
this.$('表格标识').onUnSelectAll((data) => { })
```

## 完整事件清单

以下是所有可用事件的汇总，**不在此列表中的事件禁止使用**：

`onValueChange`、`onClick`、`onItemClick`、`onCustomMsgEvent`、`onInit`、`onTreeNodeClick`、`onTreeNodeDoubleClick`、`onTreeNodeCheck`、`onTableRowClick`、`onTableRowDoubleClick`、`onCellValueChange`、`onSelect`、`onUnSelect`、`onSelectAll`、`onUnSelectAll`
