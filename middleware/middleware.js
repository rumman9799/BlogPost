const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config')

const { bindUserWithRequest } = require('./authMiddleware')
const setLocals = require('./setLocals')


const MONGODB_URI = `mongodb+srv://Rumman:121@cluster0.ybawo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

     const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
}); 

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({
        extended: true
    }),
    express.json(),
    session({
        secret: "secret" /* config.get('secret') */,
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals(),
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}