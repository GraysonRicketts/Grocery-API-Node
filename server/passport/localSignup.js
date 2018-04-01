import { Strategy as LocalStrategy } from 'passport-local'
import passport from 'passport'
import db from './../models'

const invalidLoginError = new Error('Incorrect email or password')
invalidLoginError.name = 'IncorrectCredentialsError'

export function signup(req, res, next) {
  const validationResult = validateSignupForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json({
        success: validationResult.success
    })
  }
  
  return passport.authenticate('local-signup', (err) => {
    if (err) {
      return res.status(400).json({success: false})
    }

    return res.status(200).json({
      success: true
    })
  })(req, res, next)
}

export const localSignupStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, (email, password, done) => {
    email = email.trim()
    password = password.trim()

    let newUser = new db.User({
        email,
        password
    })
    let basket = new db.Basket({
        users: [newUser._id]
    })
    newUser.baskets.push(basket._id)

    newUser.save()
      .then(() => done(null))
      .catch(err => done(err))
})

function validateSignupForm(request) {
    let isFormValid = true

    if (!request || !request.email || !request.password) {
        isFormValid = false
    }

    return {
        success: isFormValid
    }
}
