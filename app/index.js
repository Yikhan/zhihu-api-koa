const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
require('dotenv').config()

// 不写具体文件名nodejs会自动找index.js文件
const routingInit = require('./routes')

// 创建Koa实例
const app = new Koa()

const auth = async (ctx, next) => {
  if (ctx.url !== '/users') {
    ctx.throw(401)
  }
  await next()
}

// 连接mongoDB
mongoose.connect(
  process.env.MONGODB_KEY,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  }, () => {
    console.log('MongoDB Connection Success')
  })
mongoose.connection.on('error', console.error)

app.use(error({
  // 设置错误格式 生产环境不显示stack堆栈的错误信息
  postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));
app.use(bodyParser())
// koa-paramter要传入app自身
app.use(parameter(app))
routingInit(app)

// 监听端口
app.listen(3001, () => console.log('Server starts at port 3001'))