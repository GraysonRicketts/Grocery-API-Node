import chai from 'chai'
import chaiHttp from 'chai-http'

import app from './../app'
import db from './../models'
import seeds from './../../seeds'
import BaseTester from './BaseTester'
import ItemTester from './ItemTester'
import UserTester from './UserTester'

// Pre-app initializations
require('./../../config')
chai.use(chaiHttp)


const agent = chai.request.agent(app)
const collections = [
    db.Basket,
    db.User,
    db.Item
]

const itemTester = new ItemTester()
const userTester = new UserTester(agent)

/*
 * Start point for all tests
 */
describe('API', () => {
    before(testResetingCollections)

    itemTester.runAllTests()
    userTester.runAllTests()
})


/*
 * Reset Tests
 */
function testResetingCollections(done) {
    resetCollections().then(() => {
        collections.forEach((collection) => {
            if (!isCollectionEmpty(collection)) {
                throw new Error('Failed to reset ' + collection.modelName)
            }
        })

        done()
    })
    .catch((err) => {
        done(err)
    })
}

function resetCollections() {
    let removalPromises = []
    
    collections.forEach((collection) => {
        let promise = collection.remove({}).exec()
        
        removalPromises.push(promise)
    })

    return Promise.all(removalPromises)
}

async function isCollectionEmpty(collection) {
    const documents = await collection.find({}).exec()

    if (documents) {
        return false
    }

    return true
}