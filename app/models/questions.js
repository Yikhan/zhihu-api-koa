const mongoose = require('mongoose')

const { Schema, model } = mongoose

const questionSchema = new Schema({
  __v: { type: Number, select: false }, // 不显示mongoDB自带的__v字段
  title: { type: String, required: true },
  description: { type: String, required: false },
  questioner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    select: false 
  }
})

module.exports = model('Question', questionSchema)