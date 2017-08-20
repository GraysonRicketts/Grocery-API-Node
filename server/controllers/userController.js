import bcrypt from 'bcrypt'
import config from 'config'

import db from './../models'


const userController = {};

// userController.put = (req, res) => {
//     // TODO: Allow password or email to be reset
// }

userController.login = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Successfully logged in'
    })
}

userController.signup = (req, res) => {
    const { 
        email,
        password 
    } = req.body

    // TODO: Validate input
    //      TODO: Password must be less than 72 character for encryption

    // Hash password
    bcrypt
        .hash(password, config.SaltRounds)
        .then((hash) => {
            let user = new db.User({
                email,
                password: hash
            })

            const basket = new db.Basket({
                _user: user._id
            })

            user._basket = basket._id

            // Save user
            user
                .save()
                .then((newUser) => {
                    // Create new Basket associated with user
                    basket
                        .save()
                        .then((newBasket) => {
                            res.status(200).json({
                                success: true,
                                data: newUser,
                            })
                        })
                        .catch((err) => {
                            // TODO: Remove user b/c basket creation failed
                            res.status(500).json({
                                message: err.message
                            })
                        })
                })
                .catch((err) => {
                    res.status(500).json({
                        message: err.message,
                    })
                })
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message
            })
        })
}

// userController.delete = (req, res) => {
//     // TODO: Soft delete user
// }

export default userController