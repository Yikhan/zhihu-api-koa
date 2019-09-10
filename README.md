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

```js
const bodyparser = require('koa-bodyparser')
app.use(bodyparser)
```

现在可以在ctx中得到请求体
>ctx.request.body

### header

>ctx.header

## koa 基本用法

```js
app.use(async (ctx, next) => {
  if (ctx.url === '/') {
    ctx.body = 'main page'
  } else if (ctx.url === '/users') {
    if (ctx.method === 'GET') {
      ctx.body = 'user list'
    } else if (ctx.method === 'POST') {
      ctx.body = 'create user'
    } else {
      // 方法不允许
      ctx.status = 405 
    }
  } else if (ctx.url.match(/\/users\/\w+/)) {
    // 参数解析
    const userId = ctx.url.match(/\/users\/(\w+)/)[1]
    ctx.body = `this is user: ${userId}`
  } else {
    ctx.status = 404
  }
})
```

还有set函数可以使用

```js
// 可以使用set设置响应头
ctx.set('Allow', 'GET, POST')
```

## 自定义错误处理中间件

```js
app.use(async (ctx, next) => {
  try {
    await next()
  } catch(err) {
    ctx.status = err.status || err.statusCode || 500
    ctx.body = {
      message: err.message
    }
  }
})
```

需要注意的是上面的写法无法检测到404错误，404在进入该中间件之前就报错了
用koa-json-error插件可以检测到404

```js
const error = require('koa-json-error')
app.use(error({
  // 设置错误格式 生产环境不显示stack堆栈的错误信息
  postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));
```

ctx可以直接抛出异常，并且指定status code，如果不设置错误信息的话会返回status code默认对应的错误信息

```js
ctx.throw(412, 'Precondition fail: id exceeds boundary')
```

## request校验

使用koa-parameter

koa-parameter可以在app上绑定一个全局的校验方法verifyParams

```js
const parameter = require('koa-parameter')
// koa-paramter要传入app自身
app.use(parameter(app))

// 在controller中增加校验逻辑
ctx.verifyParams({
  name: { type: 'string', required: true },
  age: { type: 'number', required: false }
})
```

注意这里的verifyParams虽然名字上像在校验路由参数，但实际上校验的是请求体request.body

## JWT 安全校验

### Session 概念

Session + Cookie方案的优缺点

Pros:

- server可以主动清除session，强制client重新验证
- session保存在server，相对比较安全
- 使用灵活，兼容性较好
  
Cons:

- 跨越场景表现欠佳
- 如果是分布式部署，要实现多机共享session机制
- cookie容易被CSRF ( 跨域请求伪造攻击 )
- 查询session可能需要数据库查询

`sessionStorage` : 仅仅在当前会话下有效，关闭页面或浏览器后被清除

`localStorage` : 除非被主动清除，否则永久保留

### JWT 概念

JWT = JSON Web Token 是一个开放标准 ( RFC 7519 )

## MongoDB

### 使用Schema的select属性

使用mongoose的Schema函数时，可以使用select参数来控制某个数据项是否被api返回给client

比如password这类敏感性信息显然是不能随意返回出去的

```js
const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }
})
```

在返回的数据里可以看到password被略过了，这样可以非常方便地避免在前端代码里去filter这些敏感数据

```json
{
    "_id": "5d7739f90bf08262f8cad713",
    "name": "Xiao Ming",
    "__v": 0
}
```


