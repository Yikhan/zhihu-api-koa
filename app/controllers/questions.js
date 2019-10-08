const Question = require('../models/questions')
const User = require('../models/users')
const { getQueryFileds } = require('./helper')

class QuestionController {

  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) { ctx.throw(404, 'Question not exists') }
    // 保存找到的question，避免之后在其他函数里再次查找
    ctx.state.question = question
    await next()
  }

  // 只有问题的提问者可以操作问题
  async checkQuestioner(ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id) { 
      ctx.throw(403, 'No Authority!') 
    }
    await next()
  }

  async find(ctx) {
    // 分页
    console.log('begin to find question')
    const { per_page = 10, page = 1 } = ctx.request.query
    const showPerPage = Math.max(parseInt(per_page), 1)
    const skipPage = Math.max(parseInt(page), 1) - 1
    const q = new RegExp(ctx.query.q, "i")
    ctx.body = await Question
      .find({ $or: [{ title: q }, { description: q }] }) // 模糊搜索-匹配标题或者描述
      .limit(showPerPage).skip(skipPage * showPerPage)
  }

  async findById(ctx) {
    const { fields } = ctx.query
    const fieldsSelected = getQueryFileds(fields)
    console.log('fields query: ' + fieldsSelected)
    const question = await Question.findById(ctx.params.id)
      .select(fieldsSelected)
      .populate('questioner topics')
    ctx.body = question
  }

  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
    })

    const { title } = ctx.request.body
    const duplicateQuestion = await Question.findOne({ title })
    if (duplicateQuestion) {
      ctx.throw(409, 'Question already exists!')
    }

    // 保存新话题
    const question = await new Question(
      {
        ...ctx.request.body,
        questioner: ctx.state.user._id
      }).save()
    ctx.body = question
  }

  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false }
    })
    // update之前一定要先确认问题存在，调用checkQuestionExist中间件
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }

  async del(ctx) {
    await Question.findByIdAndDelete(ctx.params.id)
    // 请求成功但无返回数据，使用204状态
    ctx.status = 204
  }
}

module.exports = new QuestionController()