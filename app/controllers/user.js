const User = require('../models/users')

class UserController {
  async find(ctx) {
    ctx.body = await User.find()
  }

  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, 'User not found')
    }
    ctx.body = user
  }

  async create(ctx) {
    // verification
    ctx.verifyParams({
      name: { type: 'string', required: true },
    })
    // save new user
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, 'User not found')
    }
    ctx.body = user
  }

  async del(ctx) {
    const user = await User.findByIdAndDelete(ctx.params.id)
    if (!user) {
      ctx.throw(404, 'User not found')
    }
    // 请求成功但无返回数据，使用204状态
    ctx.status = 204
  }
}

module.exports = new UserController()