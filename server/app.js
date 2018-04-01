import express from 'express'
import bodyParser from 'body-parser'
import { localSignupStrategy } from './passport/localSignup'
import { localLoginStrategy } from './passport/localLogin'
import basketRoutes from './routes/basketRoutes'
import authRoutes from './routes/authRoutes'
import passport from 'passport'
import authCheckMiddleware from './middleware/auth-check'

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(passport.initialize())

// Authentication
passport.use('local-login', localLoginStrategy)
passport.use('local-signup', localSignupStrategy)

// Routes
app.use('/auth', authRoutes)
app.use('/api', authCheckMiddleware, basketRoutes)

export default app
