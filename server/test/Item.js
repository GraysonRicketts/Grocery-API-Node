import BaseTester from './BaseTester'
import seeders from './../../seeds'


class ItemTester extends BaseTester {
    constructor(schema, app) {
        super(schema, app)

        this.__numItems = require('./../../seeds/data/items').numItems
    }

    runAllTests() {
        describe('Item', () => {
            this.testCollectionEmpty()

            describe('Seeding', () => {
                this.testSeedingDb()
            })
        })
    }

    testSeedingDb(numEntriesInSeed) {
        it('it should seed the database', (done) => {
            seeders.seedItems().then(() => {
                this.__schema.find()
                    .then((documents) => {
                        documents.length.should.be.eql(this.__numItems)
                        done()
                    })
                    .catch((err) => {
                        done(err)
                    })
                })
        })
    }
}

export default ItemTester