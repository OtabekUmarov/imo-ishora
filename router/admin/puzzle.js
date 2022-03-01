const {
  Router
} = require('express')
const router = Router()
const Subject = require('../../modeles/object')
const Question = require('../../modeles/question')


const auth = require('../../middleware/auth')


router.get('/', auth, async (req, res) => {
  const subject = await Subject.find().lean()
  res.render('admin/puzzle', {
    title: 'Boshqotirmalar',
    subject,
    adminQuestion: true
  })
})

router.get('/:id/puzzleimg', auth, async (req, res) => {

  const subjectId = req.params.id
  res.render('admin/puzzle/puzzleimg', {
    title: 'Boshqotirmalar',
    subjectId,
    adminPuzzle: true
  })
})
router.get('/:id/text', auth, async (req, res) => {

  const subjectId = req.params.id
  res.render('admin/puzzle/text', {
    title: 'Matnli boshqotirma',
    subjectId,
    adminPuzzle: true
  })
})
router.get('/puzzleimg/delete/:id', async (req, res) => {
  await Question.findByIdAndDelete(req.params.id)
  res.redirect('/admin/puzzle')
})
router.get('/:id/subject', auth, async (req, res) => {
  let id = req.params.id
  const question = await Question.find({
    subjectId: id
  }).lean()
  const text = await Question.find({
    subjectId: id
  }).lean()
  res.render('admin/puzzle/view', {
    title: 'Question',
    question,
    text,
    adminQuestion: true
  })
})
router.post('/', auth, async (req, res) => {
  const {
    answer,
    subjectId
  } = req.body
  const question = req.file.path
  const puzzle = await new Question({
    answer,
    subjectId,
    question
  })
  await puzzle.save()
  res.redirect('/admin/puzzle')

})
router.post('/text', auth, async (req, res) => {

  const text = await new Question(req.body)
  await text.save()
  res.redirect('/admin/puzzle')

})


module.exports = router