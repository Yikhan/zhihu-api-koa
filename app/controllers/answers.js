const Answer = require('../models/answers')
const User = require('../models/users')
const { getQueryFileds } = require('./helper')

class AnswerController {

  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) { 
      ctx.throw(404, 'Answer not exists') 
    }
    if (answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, 'Answer does not exist under this question')
    }
    // 保存找到的answer，避免之后在其他函数里再次查找
    ctx.state.answer = answer
    await next()
  }

  // 只有回答者可以操作自己的答案
  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state
    if (answer.answerer.toString() !== ctx.state.user._id) { 
      ctx.throw(403, 'No Authority!') 
    }
    await next()
  }

  async find(ctx) {
    // 分页
    console.log('begin to find answer')
    const { per_page = 10, page = 1 } = ctx.request.query
    const showPerPage = Math.max(parseInt(per_page), 1)
    const skipPage = Math.max(parseInt(page), 1) - 1
    const q = new RegExp(ctx.query.q, "i")
    ctx.body = await Answer
      .find({ content: q, questionId: ctx.params.questionId }) // 模糊搜索-匹配问题
      .limit(showPerPage).skip(skipPage * showPerPage)
  }

  async findById(ctx) {
    const { fields } = ctx.query
    const fieldsSelected = getQueryFileds(fields)
    console.log('fields query: ' + fieldsSelected)
    const answer = await Answer.findById(ctx.params.id)
      .select(fieldsSelected)
      .populate('answerer')
    ctx.body = answer
  }

  async create(ctx) {
    // 先不用校验回答者Id和问题Id，因为可以从ctx.state和路由上获得
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    // 保存新回答
    // 加上回答者Id和问题Id
    const answer = await new Answer(
      {
        ...ctx.request.body,
        answerer: ctx.state.user._id,
        questionId: ctx.params.questionId
      }).save()
    ctx.body = answer
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    // update之前一定要先确认回答存在，route里面一定要先调用checkAnswerExist中间件
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }

  async del(ctx) {
    await Answer.findByIdAndDelete(ctx.params.id)
    // 请求成功但无返回数据，使用204状态
    ctx.status = 204
  }
}

module.exports = new AnswerController()