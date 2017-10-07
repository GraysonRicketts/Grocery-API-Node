import BaseTester from './BaseTester'
import seeders from './../../seeds'


class ItemTester extends BaseTester {
    constructor(schema, app) {
        super(schema, app)

        this.__numItems = require('./../../seeds/data/items').numItems
    }

    runAllTests() {
        this.testCollectionSize(0)
        this.testSeedingDb()
    }

    testSeedingDb() {
        it('should seed the database', (done) => {
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