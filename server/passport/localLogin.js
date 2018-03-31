import { Strategy as LocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { checkUserPassword } from './../middleware/auth'
import { jwtSecret } from './../middleware/auth'
import User from './../models/User'

const invalidLoginError = new Error('Incorrect email or password')
invalidLoginError.name = 'IncorrectCredentialsError'

export function login(req, res, next) {
    const validationResult = validateLoginForm(req.body)
    if (!validationResult.success) {
        return res.status(400).json({
            success: validationResult.success
        })
    }

    return authenticate(req, res, next)
        .then((token, baskets) => res.status(200).json({
            success: true,
            token,
            baskets
        }))
        .catch(err => res.status(400).json({success: false}))
}

export const localLoginStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, (email, password, done) => {
    email = email.trim()
    password = password.trim()

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                throw invalidLoginError
            }

            checkUserPassword(user, password).then((valid) => {
                if (!valid) {
                    throw invalidLoginError
                }

                const payload = { sub: user._id }
                const token = jwt.sign(payload, jwtSecret)

                return done(token, user.baskets)
            })
        })
})

function validateLoginForm(request) {
    let isFormValid = true

    if (!request || !request.email || !request.password) {
        isFormValid = false
    }

    return {
        success: isFormValid
    }
}

function authenticate(req, res, next) {
    return new Promise(resolve => passport.authenticate('local-login', resolve)(req, res, next))
}


