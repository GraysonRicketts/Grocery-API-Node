import express from 'express'

// Controller Imports
import basketController from './controllers/basketController'
import userController from './controllers/userController'
import passport, { authenticate } from './middleware/auth'

const routes = express()

// User Routes
routes.post('/login', passport.authenticate('local', { session: false }), userController.login)
routes.post('/signup', userController.signup)
routes.post('/logout', authenticate, userController.logout)

// Bakset Routes
routes.get('/basket/:basketId', authenticate, basketController.get)
routes.post('/basket/:basketId', authenticate, basketController.post)
routes.put('/basket/:basketId', authenticate, basketController.put)
routes.delete('/basket/:basketId', authenticate, basketController.delete)

export default routes;
