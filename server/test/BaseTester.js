import chai from 'chai'

import app from './../app'
import db from './../models'

const should = chai.should()


class BaseTester {
    constructor(schema, agent) {
        this.__schema = schema
        this.__agent = agent
        this.__testUser = require('./../../seeds/data/user').testUser        
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

    testCollectionSize(numDocuments) {
        describe('DB Initialization', () => {
            it('should be ' + numDocuments + ' documents in the collection at start of testing', (done) => {
                this.__schema.find()
                    .then((documents) => {
                        documents.length.should.be.eql(numDocuments)
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