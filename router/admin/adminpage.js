const {
  Router
} = require('express')
const router = Router()
const auth = require('../../middleware/auth')


router.get('/', auth, (req, res) => {
  res.render('admin', {
    title: 'Bosh sahifa',
    adminHome: true
  })
})
router.get('/employe', auth, (req, res) => {
  res.render('admin/employe', {
    title: 'Bosh sahifa',
    adminHome: true
  })
})





module.exports = router