import jwt from 'jsonwebtoken'
import User from './../models/User'
import Basket from './../models/Basket'
import { jwtSecret } from './auth'

function authCheckMiddleware(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end()
  }
  const token = req.headers.authorization.split(' ')[1]

  return jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).end() 
    }

    const userId = decoded.sub
    const basket = decoded.data

    // check if a user exists
    return User.findById(userId)
      .then(user => {
        if (!user) {
          throw new Error('User not found')
        }

        return Basket.findById(basket)
      })
      .then(basket => {
        if (!basket) {
          throw new Error('Basket not found')
        }

        return checkIfUserHasAccessToBasket(basket.users, userId)
      })
      .then(success => {
        if (!success) {
          throw new Error('User does not have access to basket')
        }

        return next()
      })
      .catch(err => {
        return res.status(401).end()
      })
  })
}

/**
 * Checks to see if a user is in the basket
 * @param {mongoose.ObjectId[]} basketUsers
 * @param {String} requestingUser
 * @returns {bool}
 */
async function checkIfUserHasAccessToBasket(basketUsers, requestingUser) {
  return await basketUsers.find((user) => {
      return user.toString() === requestingUser
  })
}

export default authCheckMiddleware
