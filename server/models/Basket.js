import mongoose from 'mongoose'

import BasketItem from './BasketItem'


const { Schema } = mongoose

const basketSchema = new Schema({
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    invited: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    items: {
        type: [BasketItem.Schema],
        default: []
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { usePushEach: true })

const Basket = mongoose.model('Basket', basketSchema)

export default Basket
