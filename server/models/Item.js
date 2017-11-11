import mongoose from 'mongoose'


// TODO: Consider changin item to a readonly database
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
        type: String // TODO: Possible change to object for faster lookup
    },
    
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

const Item = mongoose.model('Item', itemSchema)

export default Item