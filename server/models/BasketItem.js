import mongoose from 'mongoose'


const { Schema } = mongoose

const basketItemSchema = new Schema({
    itemDef: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: { type: Number },
    size: { type: String }
})

const BasketItem = mongoose.model('BasketItem', basketItemSchema)

export default BasketItem