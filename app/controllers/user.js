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
      password: { type: 'string', required: true }
    })

    // check if user already exists
    const { name } = ctx.request.body
    const duplicateUser = await User.findOne({ name })
    if (duplicateUser) { 
      ctx.throw(409, 'User already exists!') 
    }

    // save new user
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false }
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