import mongoose from 'mongoose'

const { Schema } = mongoose

const Categories = [
    'Dairy',
    'Produce',
    'Meat',
    'Seafood',
    'Frozen',
    'Beer/Wine/Liquor',
    'Dry Goods/Pantry'
]

// TODO: Possibly add sizes category / validation?
const itemSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        enum : Categories 
    },
    brand: {
        type: String
    },
    description: { type: String },
    
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
})

const Item = mongoose.model('Item', itemSchema)

export default Item