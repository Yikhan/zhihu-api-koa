const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()
// 使用带前缀的路由 方便中间件编写
const userRouter = new Router({ prefix: '/users' })

cons = async (ctx, next) => {
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

router.get('/', ctx => {
  ctx.body = 'main page'
})

userRouter.get('/', ctx => {
  ctx.body = [{ name: 'Li Lei' }, { name: 'Han Meimei' }]
})

userRouter.post('/', ctx => {
  ctx.body = 'create user'
})

userRouter.get('/:id', ctx => {
  ctx.body = `this is user: ${ctx.params.id}`
})

userRouter.put('/:id', ctx => {
  ctx.body = { name: 'updated Li Lei' }
})

userRouter.delete('/:id', ctx => {
  ctx.body = 'create user'
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