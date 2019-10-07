const Router = require('koa-router')
const {
  checkUserExist,
  find, 
  findById, 
  create, 
  update, 
  del, 
  login, 
  checkOwner, 
  listFollowing,
  listFollowers,
  follow,
  unfollow,
  listFollowingTopics,
  followTopic,
  unfollowTopic,
  listQuestions
} = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/users' })

// 路由调用控制器
router.get('/', find)
router.post('/', create)
router.post('/login', login)

router.get('/:id', findById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, del)

router.get('/:id/following', listFollowing)
router.get('/:id/followers', listFollowers)
router.put('/follow/:id', auth, checkUserExist, follow)
router.delete('/follow/:id', auth, checkUserExist, unfollow)

router.get('/:id/followTopics', listFollowingTopics)
router.put('/followTopics/:id', auth, checkTopicExist, followTopic)
router.delete('/followTopics/:id', auth, checkTopicExist, unfollowTopic)

router.get('/:id/questions', listQuestions)

module.exports = router


