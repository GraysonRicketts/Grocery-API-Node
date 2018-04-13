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

    return passport.authenticate('local-login', 
        (err, token, baskets) => {
            if (err) {
                return res.status(400).json({success: false})
            }

            return res.status(200).json({
                success: true,
                token,
                baskets
            })
        })(req, res, next)
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
                done(invalidLoginError)
            }

            checkUserPassword(user, password).then((valid) => {
                if (!valid) {
                    done(invalidLoginError)
                }

                const payload = {
                    sub: user._id,
                    data: user.baskets[0]
                }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' })
                const baskets = user.baskets

                return done(null, token, baskets)
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
