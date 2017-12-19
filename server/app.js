import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import routes from './routes'
import passport from './config/passport'


const RedisStore = require('connect-redis')(session)
const app = express()

// Middleware
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(session({
    secret: 'TODO: Move secret to more secure location',
    store: new RedisStore({
        host: 'redis',
        port: 6379,
        ttl: 60 * 24 * 7
    }),
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 24 * 14
    },
    resave: false,
    saveUninitialized: false
}))

// Authentication
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api', routes)

export default app