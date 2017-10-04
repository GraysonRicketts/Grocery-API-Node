import chai from 'chai'
import chaiHttp from 'chai-http'

import db from './../models'
import seeds from './../../seeds'
import BaseTester from './BaseTester'
import ItemTester from './ItemTester'
import UserTester from './UserTester'
import BasketTester from './BasketTester'
import app from './../app'

// Pre-app initializations
require('./../../config')
chai.use(chaiHttp)

// TODO: Needs to run synchronously before other tests
resetCollections()
const agent = chai.request.agent(app)

const itemTester = new ItemTester(db.Item)
const userTester = new UserTester(db.User, agent)
const basketTester = new BasketTester(db.Basket, agent)

itemTester.runAllTests()
userTester.runAllTests()
basketTester.runAllTests()

function resetCollections() {
    describe('Clean', () => {
        it('should remove all documents from all collections', (done) => {
            for (let collection in db) {
                db[collection].find({})
                    .remove()
                    .exec()
                    .then(() => {})
                    .catch((err) => {
                        done(err)
                    })
            }

            done()
        })
    })
}