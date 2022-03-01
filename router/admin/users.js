const {
    Router
} = require('express')
const router = Router()
const User = require('../../modeles/user')
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')


router.get('/', auth, async (req, res) => {
    const users = await User.find().lean()
    res.render('admin/users', {
        title: 'Foydalanuvchilar',
        add: '/admin/users/create',
        users,
        adminUser: true
    })
})
router.post('/', auth, async (req, res) => {
    try {
        let {
            name,
            lname,
            password,
            email

        } = req.body
        let img = req.file.path // !
        const hashPass = await bcrypt.hash(password, 10)
        const user = await new User({
            name,
            lname,
            password: hashPass,
            email,
            img
        })
        await user.save()
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error)
    }
})
router.get('/create', auth, async (req, res) => {
    res.render('admin/users/create', {
        title: 'Yangi foydalanuvchi',
        adminUser: true,
    })
})
router.get('/delete/:id', auth, async (req, res) => {
    await User.findByIdAndDelete(
        req.params.id
    )
    res.redirect('/admin/users')
})
router.get('/edit/:id', auth, async (req, res) => {
    const user = await User.findById(
        req.params.id
    ).lean()
    res.render('admin/users/edit', {
        title: user.name,
        user
    })
})
router.post('/save', auth, async (req, res) => {
    let {
        _id,
        name,
        lname,
        password,
        respassword,
        email

    } = req.body
    let img = ''
    if (req && req.file && req.file.path) {
        img = req && req.file && req.file.path
    }
    let pass = ''
    if (respassword) {
        let hashPass = await bcrypt.hash(respassword, 10)
        pass = hashPass
    } else pass = password
    let user = {
        name,
        lname,
        password: pass,
        email,
        img
    }
    // console.log(user);
    await User.findByIdAndUpdate({
        _id
    }, user)
    res.redirect('/admin/users')
})


module.exports = router