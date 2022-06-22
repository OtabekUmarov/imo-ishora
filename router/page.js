const {
    Router
} = require('express')
const router = Router()
const Object = require('../modeles/object')
const Question = require('../modeles/question')
const Test = require('../modeles/test')





router.get('/', (req, res) => {
    // req.flash("success", "Togri javob")
    res.render('index', {
        title: 'Bosh sahifa',
        layout: "site",
        success: req.flash('success'),
        error: req.flash('error'),
        isHome: true
    })
})

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'Biz haqimizda',
        layout: "site",
        inner: "inner_page",
        isHome: true
    })
})
router.get('/search', (req, res) => {
    res.render('search', {
        title: 'Biz haqimizda',
        layout: "site",
        inner: "inner_page",
        isHome: true
    })
})
router.get('/test', async (req, res) => {
    let count = await Test.count()
    let random = Math.floor(Math.random() * count)
    let object = await Object.find().lean()
    let test = await Test.findOne().skip(random).lean()
    let len = test.answer.split("")
    let countWord = 0
    for (let index = 0; index < len.length; index++) {
        for (let i = 0; i < index; i++) {
            if (len[index] == len[i]) {
                countWord++
                if (countWord == 2) {
                    continue
                }
                title = len[i].toLowerCase()
                let obj = await Object.findOne({
                    title
                }).lean()
                if (obj) {
                    object.push(obj)
                }
            }
        }
    }
    let size = test && test.answer && test.answer.split(' ').join("").split('')
    object = object.sort(() => (Math.random() > .5) ? 1 : -1)
    res.render('test', {
        title: 'So`zni topish',
        layout: "site",
        test,
        size,
        object,
        success: req.flash('success'),
        error: req.flash('error'),
        inner: "inner_page",
        isHome: true
    })
})

router.post('/test/answer/:id', async (req, res) => {
    let _id = req.params.id
    let {
        answer
    } = req.body
    let answerChech = await Test.findById(_id).lean()
    if (answer.toLowerCase() == answerChech.answer.toLowerCase()) {
        req.flash("id", '')
        req.flash("success", "Tog'ri javob")
    } else {
        req.flash("id", _id)
        req.flash("error", "Noto'g'ri javob")
    }
    res.redirect('/test')
})


router.get('/subject/:id', async (req, res) => {
    const id = req.params.id
    let count = await Question.count()
    let random = Math.floor(Math.random() * count)
    let subject = await Subject.findById({
        _id: id
    })
    const question = await Question.findOne({
        subjectId: id
    }).skip(random).lean()
    res.render('question', {
        title: subject.name + ' fanidan boshqotirma',
        layout: "site",
        success: req.flash('success'),
        error: req.flash('error'),
        question,
        qu_id: id,
        inner: "inner_page",
        isHome: true
    })
})

router.post('/answer/:id', async (req, res) => {
    let _id = req.params.id
    const {
        answer
    } = req.body
    const question = await Question.findById(_id)
    if (answer == question.answer) {
        req.flash("success", "Togri javob")
    } else {
        req.flash("error", "notogri javob")
    }
    res.redirect('/subject/' + req.body.qu_id)
})


router.get('/question', async (req, res) => {
    let count = await Question.count()
    let random = Math.floor(Math.random() * count)
    let object = await Object.find().lean()
    let question = await Question.findOne().skip(random).lean()
    let len = question.answer.split("")
    let countWord = 0
    for (let index = 0; index < len.length; index++) {
        for (let i = 0; i < index; i++) {
            if (len[index] == len[i]) {
                countWord++
                if (countWord == 2) {
                    continue
                }
                title = len[i].toLowerCase()
                let obj = await Object.findOne({
                    title
                }).lean()
                if (obj) {
                    object.push(obj)
                }
            }
        }
    }
    let size = question && question.answer && question.answer.split(' ').join("").split('')
    object = object.sort(() => (Math.random() > .5) ? 1 : -1)
    res.render('question', {
        title: 'Rasmli savollar',
        layout: "site",
        question,
        size,
        object,
        success: req.flash('success'),
        error: req.flash('error'),
        inner: "inner_page",
        isHome: true
    })
})
router.post('/question/answer/:id', async (req, res) => {
    let _id = req.params.id
    let {
        answer
    } = req.body
    let answerChech = await Question.findById(_id).lean()
    if (answer.toLowerCase() == answerChech.answer.toLowerCase()) {
        req.flash("id", '')
        req.flash("success", "To'gri javob")

    } else {
        req.flash("id", _id)
        req.flash("error", "Noto'gri javob")
    }
    // console.log(a);
    res.redirect('/question')
})


// router.post('/search', auth, async (req, res) => {
//     const {
//         st
//     } = req.body
//     const books = await Book.find({
//         name: {
//             $regex: '.*' + st.toLowerCase() + '.*'
//         }
//     }).select('_id name').lean()
//     res.render('search', {
//         title: `${st} so'zi bo'yicha qidiruv natijasi:`,
//         books
//     })
// })

module.exports = router