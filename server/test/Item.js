import BaseTester from './BaseTester'
import seeders from './../../seeds'


class ItemTester extends BaseTester {
    runAllTests() {
        describe('Item', () => {
            this.testCollectionEmpty()

            describe('Seeding', () => {
                this.testSeedingDb(7)
            })
        })
    }

    testSeedingDb(numEntriesInSeed) {
        it('it should seed the database', (done) => {
            seeders.seedItems().then(() => {
                this.schema.find()
                    .then((documents) => {
                        documents.length.should.be.eql(numEntriesInSeed)
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