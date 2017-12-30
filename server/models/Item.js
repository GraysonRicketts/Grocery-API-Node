import mongoose from 'mongoose'


const { Schema } = mongoose

const Categories = [
    'dairy',
    'produce',
    'meat',
    'seafood',
    'frozen',
    'beer/wine/liquor',
    'dry goods/pantry',
    'other'
]

const itemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: Categories
    },

    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

const Item = mongoose.model('Item', itemSchema)

export default Item