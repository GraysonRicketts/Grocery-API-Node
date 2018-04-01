import express from 'express'
import { login } from './../passport/localLogin'
import { signup } from './../passport/localSignup'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
// router.post('/logout')

export default router
