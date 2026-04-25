# 自定义渲染参考

本文档详述表格单元格和树节点的自定义渲染接口。渲染使用 **React 16.8** 语法（支持 JSX 和 Hooks）。

## 一、表格单元格自定义渲染（查看态）

### setCellRender

```javascript
// 方式1：渲染所有单元格
this.$('表格标识').setCellRender(CustomCellRender)

// 方式2：按列渲染（推荐）
this.$('表格标识').setCellRender({
  列id1: Render函数1,
  列id2: Render函数2
})
```

### Render 函数 props（仅限以下属性，禁止假设其他属性存在）

| 属性 | 说明 |
|------|------|
| value | 格式化后的值（受国际化影响，**非原始值**） |
| originValue | 原始真实数值 |
| rowIndex | 行号 |
| record | 行数据 |
| renderProps | 渲染属性 |
| Render | 默认渲染器（用于扩展而非完全替换） |
| parentElement | 父元素 DOM |
| isCellLock | 单元格是否锁定 |

### 示例 — 进度条渲染

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

## 二、表格单元格自定义渲染（编辑态）

### setCellEditor

```javascript
this.$('表格标识').setCellEditor({
  列id1: EditorRender函数1
})
```

### Editor Render 函数 props（仅限以下属性）

| 属性 | 说明 |
|------|------|
| value | 当前值 |
| updateEditValue | 更新编辑值的回调函数 |
| Editor | 默认编辑器 |
| getContainerEle | 获取容器 DOM |

**注意**：接管编辑态后，编辑完成需通过 `updateValue` 请求同步数据回服务端。

## 三、树节点自定义渲染

### setTreeItemRender

```javascript
this.$('树控件标识').setTreeItemRender(TreeItemRender)
```

### Render 函数 props（仅限以下属性）

| 属性 | 说明 |
|------|------|
| Render | 默认渲染器 |
| text | 节点名称 |
| id | 节点 id |
| style | 样式 |

### 示例 — 树节点扩展按钮

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

## 四、渲染规则

1. **覆盖规则**：同一控件，子页面脚本覆盖父页面脚本的自定义渲染器
2. **React 版本**：支持 React 16.8（JSX + Hooks：useState、useEffect 等）
3. **this 指向**：Render 函数中 this 不指向脚本上下文，需用外部变量（如 `self = this`）保存引用
4. **value vs originValue**：查看态 `value` 是格式化值，计算/比较请使用 `originValue`
5. **锁定状态**：查看态需关注 `isCellLock`；编辑态不需要（锁定时不可进入编辑态）
