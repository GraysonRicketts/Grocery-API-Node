import chai from 'chai'
import chaiHttp from 'chai-http'

import db from './../models'
import app from './../app'
import seeds from './../../seeds'

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
            .catch((err) => {
                done(err)
            })
      })
}

function seedItemDb() {
    it('it should seed the database', (done) => {
        seeds.ItemSeed.seed().then(() => {
            db.Item.find()
            .then((items) => {
                items.length.should.be.eql(1)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
}

describe('Item', () => {
    resetItemCollection()

    describe('Items DB Setup', () => {
        testGettingNoItems()
        seedItemDb()
    })
})