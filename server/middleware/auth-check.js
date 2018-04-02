import jwt from 'jsonwebtoken'
import User from './../models/User'
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

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end()
      }

      return next()
    })
  })
}

export default authCheckMiddleware
