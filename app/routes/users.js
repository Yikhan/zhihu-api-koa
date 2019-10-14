const Router = require('koa-router')
const user = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')
const { checkAnswerExist } = require('../controllers/answers')
const { auth } = require('../auth')

// 使用带前缀的路由 方便中间件编写
const router = new Router({ prefix: '/users' })

// 路由调用控制器
router.get('/', user.find)
router.post('/', user.create)
router.post('/login', user.login)

router.get('/:id', user.findById)
router.patch('/:id', auth, user.checkOwner, user.update)
router.delete('/:id', auth, user.checkOwner, user.del)

router.get('/:id/following', user.listFollowing)
router.get('/:id/followers', user.listFollowers)
router.put('/follow/:id', auth, user.checkUserExist, user.follow)
router.delete('/follow/:id', auth, user.checkUserExist, user.unfollow)

router.get('/:id/followTopics', user.listFollowingTopics)
router.put('/followTopics/:id', auth, checkTopicExist, user.followTopic)
router.delete('/followTopics/:id', auth, checkTopicExist, user.unfollowTopic)

router.get('/:id/questions', user.listQuestions)
// 点赞回答
router.get('/:id/approveAnswers', user.listApprovedAnswers)
router.put('/approveAnswers/:id', auth, checkAnswerExist, user.approveAnswer, user.undisapproveAnswer)
router.delete('/approveAnswers/:id', auth, checkAnswerExist, user.unapproveAnswer)
// 反对回答
router.get('/:id/disapproveAnswers', user.listDisapprovedAnswers)
router.put('/disapproveAnswers/:id', auth, checkAnswerExist, user.disapproveAnswer, user.unapproveAnswer)
router.delete('/disapproveAnswers/:id', auth, checkAnswerExist, user.undisapproveAnswer)
// 收藏回答
router.get('/:id/collectAnswers', user.listCollectedAnswers)
router.put('/collectAnswers/:id', auth, checkAnswerExist, user.collectAnswer)
router.delete('/collectAnswers/:id', auth, checkAnswerExist, user.uncollectAnswer)

module.exports = router


