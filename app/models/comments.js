const mongoose = require('mongoose')

const { Schema, model } = mongoose

const commentSchema = new Schema({
  __v: { type: Number, select: false }, // 不显示mongoDB自带的__v字段
  content: { type: String, required: true },
  commenter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false
  },
  questionId: { type: String, required: true },
  answerId: { type: String, required: true }
})

module.exports = model('Comment', commentSchema)