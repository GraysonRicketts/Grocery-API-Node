import bcrypt from 'bcryptjs'
import passport from 'passport'
import db from './../models'


const userController = {}

userController.signup = async(req, res) => {
    const {
        email,
        password
    } = req.body

    // TODO: Validate input
    // TODO: Password must be less than 72 character for encryption
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
        const hash = await bcrypt.hash(password, salt)

        let user = new db.User({
            email,
            password: hash
        })
        let basket = new db.Basket({
            users: [user._id]
        })
        user.baskets.push(basket._id)

        user.save().then(async(user) => {
                if (!user) {
                    throw new Error("Failed to save new user")
                }
                basket = await basket.save()
                if (!basket) {
                    user.remove().exec()
                    throw new Error("Failed to create a new basket when creating a new user")
                }

                req.login(user, () => {
                    res.status(200).json(loginResponse(user))
                })
            })
            .catch((err) => {
                if (err.name === "MongoError" && err.code === 11000) {
                    const dupError = new Error("Attempted to add duplicate user: " + user.email)
                    console.error(dupError)

                    res.status(409).json({
                        success: false
                    })
                    return
                }

                throw err
            })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false
        })
    }
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
