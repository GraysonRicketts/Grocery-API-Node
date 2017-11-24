import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import routes from './routes'
import passport from './config/passport'


const RedisStore = require('connect-redis')(session)
const app = express()

app
    // Middleware
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(session({
        secret: 'TODO: Move secret to more secure location',
        store: new RedisStore({
            host: 'redis',
            port: 6379,
            ttl :  60 * 24 * 7
        }),
        cookie: {
            secure: false,
            maxAge : 60 * 60 * 24 * 14
        },
        resave: false,
        saveUninitialized: false
    }))

    // Authentication
    .use(passport.initialize())
    .use(passport.session())

    // Routes
    .use('/api', routes)

export default app