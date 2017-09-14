import db from './../server/models'


let ItemSeed = {}

ItemSeed.seed = function() {
    return db.Item.find()
        .remove()
        .then(() => {
            let itemInsertPromises = []
            let items = require('./data/items').items

            items.forEach((element) => {
                const newItem = new db.Item(element)
                itemInsertPromises.push(newItem.save())
            })

            return Promise.all(itemInsertPromises)
        })
        .catch((err) => {
            console.error(err)
        })
}

export default ItemSeed