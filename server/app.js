import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'

import routes from './routes'

// Connects to DB
require('./../config/db')


const app = express()

// Middleware
app.use(bodyParser.json())

// TODO: Express sessions

app.use(passport.initialize())
// TODO: Passport session

app.use('/api', routes)

export default app