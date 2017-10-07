import chai from 'chai'
import chaiHttp from 'chai-http'

import app from './../app'
import db from './../models'
import seeds from './../../seeds'
import BaseTester from './BaseTester'
import ItemTester from './ItemTester'
import UserTester from './UserTester'
import BasketTester from './BasketTester'

// Pre-app initializations
require('./../../config')
chai.use(chaiHttp)


const agent = chai.request.agent(app)
const models = [
    db.Basket,
    db.User,
    db.Item
]

const itemTester = new ItemTester(db.Item)
const userTester = new UserTester(db.User, agent)
const basketTester = new BasketTester(db.Basket, agent)

describe('Synchronous API Tests', () => {
    testResetingCollections()
    itemTester.runAllTests()
    userTester.runAllTests()
    basketTester.runAllTests()
})

function testResetingCollections() {
    it('collections should be empty', (done) => {
        resetCollections().then(() => {
            done()
        })
        .catch((err) => {
            done(err)
        })
    })
}

function resetCollections() {
    let removalPromises = []
    
    models.forEach((model) => {
        let promise = model.remove({}).exec()
        
        removalPromises.push(promise)
    })

    return Promise.all(removalPromises)
}