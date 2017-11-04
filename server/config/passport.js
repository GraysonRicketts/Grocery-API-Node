import bcrypt from 'bcryptjs'
import passport from 'passport'

import db from './../models'


const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        db.User.findOne({ email }).exec()
            .then((user) => {
                checkUserPassword(password, user, done)
            })
            .catch((err) => {
                return done(err)
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

function checkUserPassword(password, user, done) {
    bcrypt.compare(password, user.password)
        .then((res) => {
            if (!user || !res) {
                return done(null, false, { message: 'User and/or password incorrect' })
            }

            return done(null, user)
        })
        .catch((err) => {
            done(err)
        })
}

export default passport;