import express from 'express'
import passport from 'passport'

// Controller Imports
import basketController from './controllers/basketController'
import itemController from './controllers/itemController'
import userController from './controllers/userController'


const routes = express()

// User Routes
routes.post('/login', passport.authenticate('local'), userController.login)
routes.post('/signup', userController.signup)

// Bakset Routes
routes.get('/basket/:basketId', basketController.get)
routes.post('/basket/:basketId', basketController.post)

// TODO: Remove? Items maybe static.
// Item Routes
// routes.post('/item/:itemId', itemController.post)

export default routes;