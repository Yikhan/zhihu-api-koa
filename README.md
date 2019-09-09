# zhihu-api-koa

A project of building zhihu api with Koa2 and RESTful design

## 获取Http请求参数

- query
- router params
- body
- header
  
### query

如 ?q='a' 这类的链接参数都被保存在ctx的query属性里面
>ctx.query

### router params

路由参数，如 link/q/a 这类参数保存在ctx的params属性里面
>ctx.params

### body

请求体body一般在post和put请求中经常使用

koa本身不支持解析body，需要安装额外的插件，官方推荐的是koa-bodyparser

```javascript
const bodyparser = require('koa-bodyparser')
app.use(bodyparser)
```

现在可以在ctx中得到请求体
>ctx.request.body

### header

>ctx.header
