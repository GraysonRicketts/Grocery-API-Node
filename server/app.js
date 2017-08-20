import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import session from 'express-session'

import routes from './routes'

// Connects to DB
require('./../config/db')


const app = express()

// Middleware
app.use(bodyParser.json())
app.use(session({
    secret: 'TODO: Move secret to more secure location',
    resave: false,
    saveUninitialized: false
}))

// Authentication
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api', routes)

export default app