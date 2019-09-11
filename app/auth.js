const JsonWebToken = require('jsonwebtoken')

const auth = async (ctx, next) => {
  const { authorization = ''} = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  try {
    const user = JsonWebToken.verify(token, process.env.SECRET)
    // 把user信息保存在ctx.state里面 (~ Best Practice)
    ctx.state.user = user
  } catch (err) {
    ctx.throw(401, err.message)
  }
  // 继续执行下一个中间件
  await next()
}

module.exports = {
  auth
}