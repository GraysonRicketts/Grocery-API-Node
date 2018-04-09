import mongoose from 'mongoose'


const { Schema } = mongoose

const Categories = [
    'Dairy',
    'Produce',
    'Meat',
    'Seafood',
    'Frozen',
    'Beer/wine/liquor',
    'Dry Goods / Pantry',
    'Other',
    'Uncategorized'
]

const itemSchema = new Schema({
    name: {
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
