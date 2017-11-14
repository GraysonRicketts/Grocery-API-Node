import BaseTester from './BaseTester'
import Item from './../server/models/Item'
import seeders from './../seeds'


class ItemTester extends BaseTester {
    constructor() {
        super(Item, null)

        this.__numItems = require('./../seeds/data/items').numItems
    }

    runAllTests() {
        describe('Items', () => {
            this.testSeedingDb()
        })
    }

    testSeedingDb() {
        it('should be seeded to the database', (done) => {
            seeders.seedItems()
                .then(() => {
                    this.__schema.find({}).exec()
                        .then((documents) => {
                            documents.length.should.be.eql(this.__numItems)
                            done()
                        })
                        .catch((err) => {
                            done(err)
                        })
                    })
                    .catch((err) => {
                        done(err)
                    })
        })
    }
}

export default ItemTester