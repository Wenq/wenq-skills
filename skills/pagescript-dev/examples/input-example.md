# 输入示例

每个示例标注了**场景标签**和**决策路由**，与 SKILL.md 中的需求路由决策树对应。

## 示例1：字段联动需求
**场景**：字段值变化/联动 → `onValueChange` + `setValue`

**用户输入：**
> 我有两个整数字段 `kdtest_integerfield1` 和 `kdtest_integerfield2`，想在任一字段值变化时，自动计算两个字段的和并赋值给 `kdtest_integerfield`（合计字段）。

## 示例2：样式修改需求
**场景**：字段值变化/联动 + 样式修改 → `onValueChange` + DOM 操作

**用户输入：**
> 有个下拉字段 `kdtest_combofield`，选择不同的颜色选项（red/yellow/blue）时，需要动态修改下拉框文字的颜色。

## 示例3：表格自定义渲染需求
**场景**：表格自定义渲染（查看态）→ `setCellRender`

**用户输入：**
> 表格 `kdtest_entryentity` 中有个小数字段列 `kdtest_decimalfield`，值范围0-1，想把查看态显示为进度条效果。

## 示例4：树节点扩展需求
**场景**：树节点自定义渲染 → `setTreeItemRender` + 与服务端通信

**用户输入：**
> 树控件 `kdtest_treeviewap` 的每个节点在鼠标悬停时显示一个"新增"按钮，点击按钮后与服务端交互。

## 示例5：服务端通信需求
**场景**：按钮点击 + 与服务端通信 → DOM `on('click')` + `fetchData`

**用户输入：**
> 页面上有个按钮 `kdtest_buttonap1`，点击后需要向服务端发送请求获取用户信息，方法名叫 `getUserInfo`，参数是用户名和编码。

## 示例6：大小写转换需求
**场景**：样式修改 / DOM 事件 → DOM `on('input')` + `setValue`

**用户输入：**
> 文本字段 `kdtest_textfield` 输入时，实时将小写字母自动转为大写。

## 示例7：自定义控件通信需求
**场景**：与自定义控件通信 → `invoke` + `onCustomMsgEvent`

**用户输入：**
> 文本字段 `kdtest_textfield` 值变化时，需要把新值传给自定义控件 `customcontrolap`。同时自定义控件初始化完成后要通知页面脚本。
