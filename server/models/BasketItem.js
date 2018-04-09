import mongoose from 'mongoose'

import Item from './Item'

const { Schema } = mongoose

const basketItemSchema = new Schema({
    itemDef: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },
        title: { type: String },
        category: { type: String }
    },
    number: { type: Number },
    size: { type: String },
    note: {
        type: String,
        maxlength: 250,
        trim: true
    },
})

const BasketItem = mongoose.model('BasketItem', basketItemSchema)

export default BasketItem
