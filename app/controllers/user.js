const User = require('../models/users')
const JsonWebToken = require('jsonwebtoken')
const { getQueryFileds } = require('./helper')

class UserController {
  async find(ctx) {
    ctx.body = await User.find()
  }

  async findById(ctx) {
    const { fields } = ctx.query
    const fieldsSelected = getQueryFileds(fields)
    console.log('fields query: ' + fieldsSelected);
    const user = await User.findById(ctx.params.id).select(fieldsSelected)
    if (!user) {
      ctx.throw(404, 'User not found')
    }
    ctx.body = user
  }

  async create(ctx) {
    // 校验
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })

    // 判断用户是否已经存在
    const { name } = ctx.request.body
    const duplicateUser = await User.findOne({ name })
    if (duplicateUser) {
      // 用户存在，抛出409冲突
      ctx.throw(409, 'User already exists!')
    }

    // 保存新用户
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      industries: { type: 'string', required: false },
      careers: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
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

  async login(ctx) {
    // 校验
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      // 抛出401 鉴权失败
      ctx.throw(401, 'Username or password invalid')
    }
    // JWT 生成令牌
    const { _id, name } = user
    const token = JsonWebToken.sign({ _id, name }, process.env.SECRET, { expiresIn: '1d' })
    ctx.body = { token }
  }

  // 确认要更改的用户是当前用户自己，避免用户可以随意改其他用户数据的情况
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, 'No access!')
    }
    await next()
  }
}

module.exports = new UserController()