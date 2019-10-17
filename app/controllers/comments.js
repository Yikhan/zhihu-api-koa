const Comment = require('../models/comments')
const { getQueryFileds } = require('./helper')

class commentController {

  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commenter')
    if (!comment) { 
      ctx.throw(404, 'comment not exists') 
    }
    // 检查问题和回答下是否有该评论
    if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) {
      ctx.throw(404, 'comment does not exist under this question')
    }
    if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
      ctx.throw(404, 'comment does not exist under this answer')
    }
    // 保存找到的comment，避免之后在其他函数里再次查找
    ctx.state.comment = comment
    await next()
  }

  async checkCommenter(ctx, next) {
    const { comment } = ctx.state
    if (comment.commenter.toString() !== ctx.state.user._id) { 
      ctx.throw(403, 'No Authority!') 
    }
    await next()
  }

  async find(ctx) {
    // 分页
    console.log('begin to find comment')
    const { per_page = 10, page = 1 } = ctx.request.query
    const showPerPage = Math.max(parseInt(per_page), 1)
    const skipPage = Math.max(parseInt(page), 1) - 1
    const q = new RegExp(ctx.query.q, "i")
    const { questionId, answerId } = ctx.params
    ctx.body = await Comment
      .find({ content: q, questionId, answerId }) // 模糊搜索-匹配问题
      .limit(showPerPage).skip(skipPage * showPerPage)
      .populate('commenter')
  }

  async findById(ctx) {
    const { fields } = ctx.query
    const fieldsSelected = getQueryFileds(fields)
    console.log('fields query: ' + fieldsSelected)
    const comment = await Comment.findById(ctx.params.id)
      .select(fieldsSelected)
      .populate('commenter')
    ctx.body = comment
  }

  async create(ctx) {
    // 先不用校验评论人的Id和问题Id，因为可以从ctx.state和路由上获得
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    // 保存新评论
    // 加上评论人Id和问题Id
    const commenter = ctx.state.user._id
    const { questionId, answerId } = ctx.params
    const comment = await new Comment(
      {
        ...ctx.request.body,
        commenter,
        questionId,
        answerId
      }).save()
    ctx.body = comment
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    // 使用update之前要先调用checkcommentExist查找要更新的评论
    await ctx.state.comment.update(ctx.request.body)
    ctx.body = ctx.state.comment
  }

  async del(ctx) {
    await Comment.findByIdAndDelete(ctx.params.id)
    // 请求成功但无返回数据，使用204状态
    ctx.status = 204
  }
}

module.exports = new commentController()