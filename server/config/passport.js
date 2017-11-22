import bcrypt from 'bcryptjs'
import passport from 'passport'

import db from './../models'


const LocalStrategy = require('passport-local').Strategy
const passwordError = 'User and/or password incorrect'

passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
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

passport.serializeUser((user, done) => {
    const sessionUser = {
        id: user._id,
        basketId: user._basket
    }
    done(null, sessionUser)
})

passport.deserializeUser((sessionUser, done) => {
    done(null, sessionUser)
})

/**
 * Checks to see if the password provided matches the password in the database
 * @param {string} password 
 * @param {string} user 
 * @param {Function} done 
 */
function checkUserPassword(password, user, done) {
    bcrypt.compare(password, user.password)
        .then((res) => {
            if (!user || !res) {
                return done(null, false, { message: passwordError })
            }

            done(null, user)
        })
        .catch((err) => {
            done(err)
        })
}

export default passport;