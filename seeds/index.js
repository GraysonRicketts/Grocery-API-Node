import Item from './../server/models/Item'


const seeders = {}

seeders.seedItems = function() {
    return Item.find()
        .remove()
        .then(() => {
            let insertPromises = []
            let data = require('./data/items').data

            data.forEach((element) => {
                const newDocument = new Item(element)
                insertPromises.push(newDocument.save())
            })

            return Promise.all(insertPromises)
        })
        .catch((err) => {
            console.error(err)
        })
}


export default seeders