import bcrypt from 'bcryptjs'

import db from './../models'


const userController = {};


userController.login = (req, res) => {
    res.status(200).json({
        success: true,
    })
}

userController.signup = (req, res) => {
    const { 
        email,
        password 
    } = req.body

    // TODO: Validate input
    // TODO: Password must be less than 72 character for encryption

    // Hash password
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS)).then((salt) => {
        bcrypt.hash(password, salt).then((hash) => {
            let user = new db.User({
                email,
                password: hash
            })

            const basket = new db.Basket({
                user: user._id
            })

            user._basket = basket._id

            // Save user
            user.save()
                .then((newUser) => {
                    // Create new Basket associated with user
                    basket
                        .save()
                        .then((newBasket) => {
                                if (!newBasket) {
                                    throw new Error("Failed to create a new basket when creating a new user")
                                }

                            req.login(newUser, () => {
                                    res.status(200).json({
                                        success: true
                                    })
                                })
                        })
                        .catch((err) => {
                            // TODO: Remove user b/c basket creation failed
                                console.error(err)
                            res.status(500).json({
                                    success: false
                            })
                        })
                })
                .catch((err) => {
                        console.error(err)
                    res.status(500).json({
                            success: false
                    })
                })
            })
            .catch((err) => {
                console.error(err)
                res.status(500).json({
                    success: false
                })
            })
        })
}

userController.logout = (req, res) => {
    req.logout()    
    req.session.destroy(() => {
        res.status(200).json({
            success: true
        })
    })
}

// userController.delete = (req, res) => {
//     // TODO: Soft delete user
// }

// userController.put = (req, res) => {
//     // TODO: Allow password or email to be reset
// }

export default userController