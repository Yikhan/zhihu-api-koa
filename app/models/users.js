const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false }, // 不显示mongoDB自带的__v字段
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male', required: true },
  headline: { type: String },
  locations: { type: [{ type: String }], select: false },
  industries: { type: String, select: false },
  careers: {
    type: [{
      company: { type: String },
      occupation: { type: String }
    }],
    select: false
  },
  educations: {
    type: [{
      school: { type: String },
      major: { type: String },
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
      enrollment_year: { type: Number },
      graduation_year: { type: Number }
    }],
    select: false
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 引用User的id 相当于关系型数据库的外键
    select: false
  }
})

module.exports = model('User', userSchema)