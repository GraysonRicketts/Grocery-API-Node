import mongoose from 'mongoose'

import Item from './Item'

const { Schema } = mongoose

// const customItem = new Schema({
//     title: { type: String,required:true },
//     description: { type: String },
//     isDeleted: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now },
// })

const basketItem = new Schema({
    _item: { 
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    quantity: { type: Number },
    size: { type: String }, // TODO: Expand to have multiple types of size or category list to choose from
    note: { type: String }
})

const basketSchema = new Schema({
    _user: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    _items: {
        type: [ basketItem ],
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