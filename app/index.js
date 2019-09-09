const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
// 不写具体文件名nodejs会自动找index.js文件
const routingInit = require('./routes')

const app = new Koa()
const router = new Router()
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
app.use(bodyParser())
routingInit(app)


// 监听端口
app.listen(3001, () => console.log('Server starts at port 3001'))