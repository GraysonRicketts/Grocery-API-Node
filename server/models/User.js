import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: [5, 'Password must be 5 characters or more.'],
        required: true,
    },
    baskets: {
        type: [Schema.Types.ObjectId],
        ref: 'Basket'
    },
    invites: {
        type: [Schema.Types.ObjectId],
        ref: 'Basket',
        default: []
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
})

userSchema.pre('save', function saveHook(next) {
    const user = this
    const saltRound = parseInt(process.env.SALT_ROUNDS) || 3

    if (!user.isModified('password')) {
        return next()
    }

    return bcrypt.genSalt(saltRound)
        .then(salt => bcrypt.hash(user.password, salt))
        .then((hash) => {
            user.password = hash
            return next()
        })
    }
)

const User = mongoose.model('User', userSchema)
export default User
