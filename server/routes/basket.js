import express from 'express'
import basketController from './../controllers/basketController'

const router = express.Router()

router.get('/basket/:basketId', basketController.get)
router.post('/basket/:basketId', basketController.post)
router.put('/basket/:basketId', basketController.put)
router.delete('/basket/:basketId', basketController.delete)

export default router
