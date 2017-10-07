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

    testCollectionSize(numDocuments) {
        const testString = 'should be ' + 
            numDocuments + 
            ' documents in the collection at start of testing'

        it(testString, (done) => {
            this.__schema.find({})
                .then((documents) => {
                    documents.length.should.be.eql(numDocuments)
                    done()
                })
                .catch((err) => {
                    done(err)
            })
        })
    }
}

export default BaseTester