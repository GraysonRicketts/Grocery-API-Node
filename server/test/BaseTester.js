import chai from 'chai'

import app from './../app'
import db from './../models'

const should = chai.should()


class BaseTester {
    constructor(schema, app) {
        this.schema = schema
        this.app = app
    }

    static resetCollections() {
        beforeEach((done) => {
            let removalPromises = []
            
            for (let collection in db) {
                removalPromises.push(
                    db[collection].remove()
                        .catch((err) => {
                            done(err)
                        })
                )
            }
            
            Promise.all(removalPromises)
                .then(() => {
                    done()
                })
                .catch((err) => {
                    done(err)
                })
        })
    }

    testCollectionEmpty() {
        describe('DB Cleanup', () => {
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
        })
    }
}

export default BaseTester