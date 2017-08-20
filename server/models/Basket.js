import mongoose from 'mongoose'

import Item from './Item'
import BasketItem from './BasketItem'


const { Schema } = mongoose

// const customItem = new Schema({
//     title: { type: String,required:true },
//     description: { type: String },
//     isDeleted: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now },
// })

const basketSchema = new Schema({
    _user: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    _items: {
        type: [ BasketItem.Schema ],
        default: []
    },
    customItems: { 
        type: [ Item.Schema ],
        default: []
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
})

const Basket = mongoose.model('Basket', basketSchema)

export default Basket