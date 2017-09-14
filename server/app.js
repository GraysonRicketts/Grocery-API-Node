import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'

import routes from './routes'
import passport from './../config/passport'


const RedisStore = connectRedis(session)
const client = redis.createClient()
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
            host: 'localhost', 
            port: 6379, 
            client: client,
            ttl :  60 * 24 * 7 
        }),
        resave: false,
        saveUninitialized: false
    }))

    // Authentication
    .use(passport.initialize())
    .use(passport.session())

    // Routes
    .use('/api', routes)

export default app