const Koa = require('koa')
const Router = require('koa-router')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
// 加载.env
require('dotenv').config()

// 不写具体文件名nodejs会自动找index.js文件
const routingInit = require('./routes')

// 创建Koa实例
const app = new Koa()

/* #region  常用变量 */

// 上传文件存放的路径
const uploadDir = path.join(__dirname, 'public/uploads')
console.log('Upload path: ', uploadDir)

/* #endregion */

// 连接mongoDB
mongoose.connect(
  process.env.MONGODB_KEY,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }, () => {
    console.log('MongoDB Connection Success')
  })
mongoose.connection.on('error', console.error)

/* #region 配置插件 */

app.use(KoaStatic(path.join(__dirname, 'public')))
app.use(error({
  // 设置错误格式 生产环境不显示stack堆栈的错误信息
  postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
app.use(KoaBody({
  multipart: true,
  formidable: {
    uploadDir: uploadDir,
    keepExtensions: true // 保留图片文件扩展名
  }
}))
// koa-paramter要传入app自身
app.use(parameter(app))

/* #endregion */

// 注册路由
routingInit(app)

// 监听端口
const PortNumber = process.env.PORT_NUMBER
app.listen(PortNumber, () => console.log(`Server starts at port ${PortNumber}`))