import chai from 'chai'
import chaiHttp from 'chai-http'

import db from './../models'
import app from './../app'
import seeds from './../../seeds'

const should = chai.should()


const ItemTest = {}

function resetItemCollection() {
    beforeEach((done) => {
        db.Item.remove()
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err)
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
        seeds.ItemSeeder.seed().then(() => {
            db.Item.find()
            .then((items) => {
                items.length.should.be.eql(7)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
}

ItemTest.dbSetup = function() {
    resetItemCollection()

    describe('Items DB Setup', () => {
        testGettingNoItems()
        seedItemDb()
    })
}

ItemTest.runAllTests = function() {
    describe('Item', () => {
        ItemTest.dbSetup()
    })
}

export default ItemTest