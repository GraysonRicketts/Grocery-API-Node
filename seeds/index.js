import db from './../server/models'


const seeders = {}

seeders.seedItems = function() {
    return db.Item.find()
        .remove()
        .then(() => {
            let insertPromises = []
            let data = require('./data/items').data

            data.forEach((element) => {
                const newDocument = new db.Item(element)
                insertPromises.push(newDocument.save())
            })

            return Promise.all(insertPromises)
        })
        .catch((err) => {
            console.error(err)
        })
}


export default seeders