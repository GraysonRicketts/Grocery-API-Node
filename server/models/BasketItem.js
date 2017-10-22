import mongoose from 'mongoose'


const { Schema } = mongoose

const basketItemSchema = new Schema({
  // TODO: Becuase this is never being saved it is never being validated
  itemDef: { 
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: { type: Number, required: true },
  size: { type: String } // TODO: Expand to have multiple types of size or category list to choose from
})

const BasketItem = mongoose.model('BasketItem', basketItemSchema)

export default BasketItem