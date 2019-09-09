const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()
// 使用带前缀的路由 方便中间件编写
const userRouter = new Router({ prefix: '/users' })

const auth = async (ctx, next) => {
  if (ctx.url !== '/users') {
    ctx.throw(401)
  }
  await next()
}

/* 基本用法
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
*/

const db = [{ name: 'Li Lei' }]

router.get('/', ctx => {
  ctx.body = 'main page'
})

userRouter.get('/', ctx => {
  // 可以使用set设置响应头
  ctx.set('Allow', 'GET, POST')
  ctx.body = db
})

userRouter.post('/', ctx => {
  db.push(ctx.request.body)
  ctx.body = ctx.request.body
})

userRouter.get('/:id', ctx => {
  ctx.body = db[parseInt(ctx.params.id)]
})

userRouter.put('/:id', ctx => {
  const index = parseInt(ctx.params.id)
  db[index] = ctx.request.body
  ctx.body = ctx.request.body
})

userRouter.delete('/:id', ctx => {
  const index = parseInt(ctx.params.id)
  db.splice(index, 1)
  // 请求成功但无返回数据，使用204状态
  ctx.status = 204
})

app.use(bodyParser())
// 注册koa-router
app.use(router.routes())
app.use(userRouter.routes())
// 允许使用options请求返回允许的方法
// 自动返回405当收到未允许的方法请求时
app.use(userRouter.allowedMethods())

// 监听端口
app.listen(3001)