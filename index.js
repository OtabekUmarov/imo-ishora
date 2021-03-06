const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash') // !
// Routerlar
const adminpageRouter = require('./router/admin/adminpage')
const authRouter = require('./router/admin/auth')
const usersRouter = require('./router/admin/users')
const testRouter = require('./router/admin/test')
const objectRouter = require('./router/admin/object')
const questionRouter = require('./router/admin/question')


const pageRouter = require('./router/page')
// const usersRouter = require('./router/users')
const profileRouter = require('./router/profile')

// middleWare lar
const varMid = require('./middleware/var')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys/pro')

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'admin',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + '/public'))
app.use('/images', express.static('images')) // !

const store = new MongoStore({
    collection: 'session',
    uri: keys.MONGODB_URI
})
app.use(session({
    secret: keys.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 60 * 1200 * 100
    },
    store
}))

app.use(fileMiddleware.single('img'))
app.use(csrf())
app.use(flash()) // !
app.use(varMid)

app.use(pageRouter)
app.use('/admin', adminpageRouter)
app.use('/admin/users', usersRouter)
app.use('/admin/test', testRouter)
app.use('/admin/object', objectRouter)
app.use('/admin/question', questionRouter)


// app.use('/users', usersRouter)
app.use('/admin/auth', authRouter)
app.use('/profile', profileRouter)
app.all('*', (req, res) => {
    res.status(404).render('404', {
        layout: "404"
    });
});
const port = process.env.PORT || '3009'
async function dev() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true
        })
        app.listen(port, () => {
            console.log('Server is running')
        })
    } catch (error) {
        console.log(error)
    }
}
dev()
