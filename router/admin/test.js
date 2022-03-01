const {
  Router
} = require('express')
const router = Router()
const Test = require('../../modeles/test')
const auth = require('../../middleware/auth')


router.get('/', auth, async (req, res) => {
  const test = await Test.find().lean()
  res.render('admin/test', {
    title: 'Test yaratish',
    adminPuzzle: true,
    test
  })
})

router.get('/delete/:id', auth, async (req, res) => {
  let _id = req.params.id
  await Test.findByIdAndDelete(
    _id
  )
  res.redirect('/admin/test')
})
router.post('/', auth, async (req, res) => {
  let {
    answer
  } = req.body
  // answer = answer.toLowerCase()
  const test = await new Test({
    answer
  })
  await test.save()
  res.redirect('/admin/test')

})





module.exports = router