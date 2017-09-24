import chai from 'chai'
import chaiHttp from 'chai-http'

import app from './../app'
import db from './../models'

const should = chai.should()
chai.use(chaiHttp)


class BaseTester {
    constructor(schema, app) {
        this.__schema = schema
        this.__agent = chai.request.agent(app)
    }

    static resetCollections() {
        describe('Clean', () => {
            it('should remove all documents from all collections', (done) => {
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
        })
    }

    testCollectionEmpty() {
        describe('DB Cleanup', () => {
            it('there should be nothing in the collection', (done) => {
                this.__schema.find()
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