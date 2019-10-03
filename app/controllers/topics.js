const Topic = require('../models/topics')
const { getQueryFileds } = require('./helper')

class TopicController {
  async find(ctx) {
    // 分页
    const { per_page = 10, page = 1 } = ctx.request.query
    const showPerPage = Math.max(parseInt(per_page), 1)
    const skipPage = Math.max(parseInt(page), 1) - 1
    ctx.body = await Topic
      .find({ name: new RegExp(ctx.query.q, "i") }) // 模糊搜索
      .limit(showPerPage).skip(skipPage * showPerPage)
  }

  async findById(ctx) {
    const { fields } = ctx.query
    const fieldsSelected = getQueryFileds(fields)
    console.log('fields query: ' + fieldsSelected)
    const topic = await Topic.findById(ctx.params.id).select(fieldsSelected)
    ctx.body = topic
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })

    const { name } = ctx.request.body
    const duplicateTopic = await Topic.findOne({ name })
    if (duplicateTopic) {
      ctx.throw(409, 'Topic already exists!')
    }

    // 保存新话题
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })

    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!topic) {
      ctx.throw(404, 'Topic not found')
    }
    // 注意mongoose返回的topic是更新前的
    ctx.body = topic
  }
}

module.exports = new TopicController()