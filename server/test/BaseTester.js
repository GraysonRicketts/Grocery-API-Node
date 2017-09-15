import chai from 'chai'

import app from './../app'

const should = chai.should()


class BaseTester {
    constructor(schema, seeder, numSeeds) {
        this.schema = schema
        this.seeder = seeder
        this.numSeeds = numSeeds
    }

    setupDb() {
        this.resetCollection()

        describe('DB Setup', () => {
            this.testCollectionEmpty()
            this.testSeedingDb(this.numSeeds)
        })
    }

    resetCollection() {
        beforeEach((done) => {
        this.schema.remove()
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    }

    testSeedingDb(numEntriesInSeed) {
        it('it should seed the database', (done) => {
        this.seeder.seed().then(() => {
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

    testCollectionEmpty() {
        it('there should be nothing in the collection', (done) => {
        this.schema.find()
            .then((documents) => {
                documents.length.should.be.eql(0)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    }
}

export default BaseTester