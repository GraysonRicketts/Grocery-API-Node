import chai from 'chai'
import chaiHttp from 'chai-http'

import db from './../models'
import app from './../app'

const should = chai.should()


function resetItemCollection() {
    beforeEach((done) => {
        db.Item.remove({})
            .then(() => {
                done()
            })
            .catch((err) => {
                console.error(err)
            })
    })
}

function testGettingNoItems() {
    it('it should GET no the items when no items exist', (done) => {
        db.Item.find()
            .then((items) => {
                items.length.should.be.eql(0)
                done()
            })
      })
}

describe('Item', () => {
    resetItemCollection()

    describe('/GET Item', () => {
        testGettingNoItems()
    })
})