import bcrypt from 'bcryptjs'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import db from './../models'

const config = {
    jwtSecret: 'blahblahblah'
}
const LocalStrategy = require('passport-local').Strategy
const passwordError = 'User and/or password incorrect'

export function authenticate(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).end()
    }

    // get the last part from a authorization header string like "bearer token-value"
    const token = req.headers.authorization.split(' ')[1]

    // decode the token using a secret key-phrase
    return jwt.verify(token, config.jwtSecret)
        .then((decoded) => {
            const userId = decoded.sub

            // check if a user exists
            User.findById(userId)
                .then((user) => {
                    if (!user) {
                        return res.status(401).end()
                    }

                    return next()
                })
                .catch((err) => {
                    return (res.status(401).json({
                        success: false
                    }))
                })
            })
        .catch((err) => { console.error(err) })
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, (email, password, done) => {
    email = email.trim()
    password = password.trim()

    db.User.findOne({ email }).exec()
        .then((user) => {
            if (!user) {
                return done(null, false, { message: passwordError })
            }

            checkUserPassword(password, user, done)
        })
        .catch((err) => {
            done(err)
        })
}))

/**
 * Checks to see if the password provided matches the password in the database
 * @param {string} password 
 * @param {string} user 
 * @param {Function} done 
 */
// TODO: use promise chaining
function checkUserPassword(password, user, done) {
    bcrypt.compare(password, user.password)
        .then((res) => {
            if (!user || !res) {
                return done(null, false, { message: passwordError })
            }

            const payload = {
                sub: user._id
            }
        
            // create a token string
            const token = jwt.sign(payload, config.jwtSecret)

            done(null, user, token)
        })
        .catch((err) => {
            done(err)
        })
}

export default passport
