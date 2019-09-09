const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')

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

app.use(error({
  // 设置错误格式 生产环境不显示stack堆栈的错误信息
  postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));
app.use(bodyParser())
routingInit(app)

// 监听端口
app.listen(3001, () => console.log('Server starts at port 3001'))