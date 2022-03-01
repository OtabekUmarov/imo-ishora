const {
  Router
} = require('express')
const router = Router()
const Question = require('../../modeles/question')
const auth = require('../../middleware/auth')


router.get('/', auth, async (req, res) => {
  const question = await Question.find().lean()
  res.render('admin/question', {
    title: 'Rasmli ishoralar',
    adminQuestion: true,
    question
  })
})
router.get('/create', auth, (req, res) => {
  res.render('admin/question/create', {
    title: "Savol qo'shish",
    adminQuestion: true,
  })
})
router.get('/delete/:id', auth, async (req, res) => {
  let _id = req.params.id
  await Question.findByIdAndDelete(
    _id
  )
  res.redirect('/admin/question')
})
router.post('/', auth, async (req, res) => {
  let {
    answer
  } = req.body
  let img = req.file.path
  answer = answer.toLowerCase()
  const question = await new Question({
    answer,
    img
  })
  await question.save()
  res.redirect('/admin/question')

})

module.exports = router