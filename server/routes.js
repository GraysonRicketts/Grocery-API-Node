import express from 'express'

// Controller Imports
import basketController from './controllers/basketController'
import itemController from './controllers/itemController'
import userController from './controllers/userController'
import passport from './../config/passport'


const routes = express()

// User Routes
routes.post('/login', passport.authenticate('local'), userController.login)
routes.post('/signup', userController.signup)
routes.post('/logout', authenticationMiddleware(true), userController.logout)

// Bakset Routes
routes.get('/basket', authenticationMiddleware(true), basketController.get)
routes.post('/basket', authenticationMiddleware(true), basketController.post)

// TODO: Remove? Items maybe static.
// Item Routes
// routes.post('/item/:itemId', itemController.post)

function authenticationMiddleware(shouldAlreadyBeAuthenticated) {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            if (shouldAlreadyBeAuthenticated) {
                next()
            } else {
                res.status(400).json({
                    success: false
                })
            }
        } else {
            if (!shouldAlreadyBeAuthenticated) {
                next()   
            }
            res.status(401).json({
                success: false
            })
        }
    }
}

export default routes;