import bcrypt from 'bcrypt'
import passport from 'passport'

import db from './../server/models'


const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((email, password, done) => {
    db.User
        .findOne({ email: email })
        .exec()
        .then((user) => {
            bcrypt
                .compare(password, user.password)
                .then((res) => {
                    if (!user || !res) {
                        return done(null, false, { message: 'User and/or password incorrect' })
                    }

                    return done(null, user)
                })  
        })
        .catch((err) => {
            return done(err)
        })
}))