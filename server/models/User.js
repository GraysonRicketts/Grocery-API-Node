import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: [8, 'Password must be 8 characters or more.'],
        required: true,
    },
    _basket: { 
        type: Schema.Types.ObjectId,
        ref: 'Basket'
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema)

export default User