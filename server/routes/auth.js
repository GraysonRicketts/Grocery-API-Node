import express from 'express'
import { login } from './../passport/localLogin'

const router = express.Router()

// User Routes
router.post('/login', login)
// router.post('/signup', )
// router.post('/logout')

export default router
