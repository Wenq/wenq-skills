# 通信协议参考

本文档详述页面脚本与自定义控件、服务端插件的通信方式。

## 一、与自定义控件通信

### 1.1 页面脚本 → 自定义控件（invoke）

通过 `invoke` 向自定义控件发送消息，自定义控件内部通过 `handleDirective` 方法接收。

```javascript
// 页面脚本发送
this.$('customcontrolap').invoke('methodName', { data: someValue })
```

**自定义控件内部接收**（参考，非页面脚本代码）：
```javascript
handleDirective(methodName, args) {
  // 处理来自页面脚本的消息
}
```

### 1.2 自定义控件 → 页面脚本（onCustomMsgEvent）

页面脚本通过 `onCustomMsgEvent` 监听自定义控件发出的消息。

```javascript
// 页面脚本监听
this.$('customcontrolAp').onCustomMsgEvent((data) => {
  if (data.args && data.args.type === '__init__') {
    // 自定义控件初始化完成
  } else {
    // 处理其他消息
  }
})
```

**自定义控件内部发送**（参考，非页面脚本代码）：
```javascript
this.model.triggerCustomMsgEvent('dataChange', { name: '名称1', code: '888' })
```

### 1.3 双向通信完整示例

```javascript
function didMount() {
  // 页面脚本 → 自定义控件：字段值变化时发送
  this.$('kdtest_textfield').onValueChange((data) => {
    this.$('customcontrolap').invoke('textFieldValueChange', { data: data.newValue })
  })

  // 自定义控件 → 页面脚本：接收消息
  this.$('customcontrolap').onCustomMsgEvent((data) => {
    if (data.args && data.args.type === '__init__') {
      console.log('自定义控件初始化完成')
    }
  })
}
```

## 二、与服务端插件通信（fetchData）

### 2.1 前端发送请求

```javascript
this.fetchData('methodName', { param1: 'value1' }).then((result) => {
  // 处理服务端返回的数据
  console.log(result)
})
```

### 2.2 服务端接收处理（KS 脚本）

服务端通过重载 `customEvent` 接收，固定事件 key 为 `__clientRequest__`。

```javascript
customEvent(e) {
  const key = e.getKey()
  const eventName = e.getEventName()
  const eventArgs = e.getEventArgs()
  if (key === '__clientRequest__') {
    if (eventName === 'methodName') {
      // 处理业务逻辑...
      // 通过 setPageJSData 全局指令返回数据
      this.getView().getClientProxy().addAction('setPageJSData', {
        name: 'resultKey',
        args: { /* 返回数据 */ }
      })
    }
  }
}
```

### 2.3 通信要点

1. `fetchData` 返回 Promise，必须用 `.then()` 处理
2. 服务端固定 key：`__clientRequest__`
3. 服务端通过 `setPageJSData` 全局指令返回数据给前端
4. `eventName` 对应前端 `fetchData` 的第一个参数
5. `eventArgs` 对应前端 `fetchData` 的第二个参数
