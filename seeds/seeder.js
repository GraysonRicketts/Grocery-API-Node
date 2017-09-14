class seeder {
    constructor(dbObjectSchema, dataFile) {
        this.dbObjectSchema = dbObjectSchema
        this.dataFile = dataFile
    }

    seed() {
        return this.dbObjectSchema.find()
        .remove()
        .then(() => {
            let insertPromises = []
            let data = require(this.dataFile).data

            data.forEach((element) => {
                const newDocument = new this.dbObjectSchema(element)
                insertPromises.push(newDocument.save())
            })

            return Promise.all(insertPromises)
        })
        .catch((err) => {
            console.error(err)
        })
    }
}

export default seeder