import chai from 'chai'
import chaiHttp from 'chai-http'

import db from './../models'
import app from './../app'
import seeds from './../../seeds'

const should = chai.should()


const UserTest = {}

function resetItemCollection() {
    beforeEach((done) => {
        db.Item.remove({})
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err)
            })
    })
}

function testGettingNoUsers() {
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
                items.length.should.be.eql(7)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
}

UserTest.dbSetup = function() {
    resetItemCollection()

    describe('Items DB Setup', () => {
        testGettingNoUsers()
        seedItemDb()
    })
}

UserTest.runAllTests = function() {
    describe('Item', () => {
        UserTest.dbSetup()
    })
}

export default UserTest