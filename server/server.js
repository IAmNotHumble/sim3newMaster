const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const massive = require('massive')
const path = require('path')

require('dotenv').config()

const app = express()
const port = 4200

//controllers
const AuthCtrl = require('./controllers/AuthCtrl')
const PostCtrl = require('./controllers/PostCtrl')

massive(process.env.CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log(`Never gonna run around and desert db!`)
}).catch(err => console.log(err))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(bodyParser.json())


//auth
app.post('/login', AuthCtrl.login)
app.post('/register', AuthCtrl.register)

//post 
app.get('/api/posts/', PostCtrl.read)
app.post('/api/post/:userid', PostCtrl.create)



app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'), function (err) {
        if(err) {
            res.status(500).send(err)
        }
    })
})

app.listen(port, () => {
    console.log(`Never gonna give ${port} up, Never gonna let ${port} down.`)
})