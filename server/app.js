import express from 'express'
import bodyParser from 'body-parser'

import routes from './routes'
import passport from './middleware/auth'

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

// Authentication
app.use(passport.initialize())

// Routes
app.use('/api', routes)

export default app
