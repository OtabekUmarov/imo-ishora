const {
  Router
} = require('express')
const router = Router()
const Object = require('../../modeles/object')
const auth = require('../../middleware/auth')


router.get('/', auth, async (req, res) => {
  const subject = await Object.find().lean()
  res.render('admin/object', {
    title: 'Imo ishoralar ',
    adminSubject: true,
    add: '/admin/object/create',
    subject
  })
})
router.get('/create', auth, (req, res) => {
  res.render('admin/object/create', {
    title: "Fan qo'shish",
    adminSubject: true,
  })
})
router.get('/delete/:id', auth, async (req, res) => {
  let _id = req.params.id
  await Object.findByIdAndDelete(
    _id
  )
  res.redirect('/admin/object')
})
router.post('/', auth, async (req, res) => {
  let {
    title,
    type
  } = req.body
  let img = req.file.path
  title = title.toLowerCase()
  const object = await new Object({
    title,
    type,
    img
  })
  await object.save()
  res.redirect('/admin/object')

})





module.exports = router