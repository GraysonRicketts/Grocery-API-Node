import chai from 'chai'
import chaiHttp from 'chai-http'

import app from './../server/app'
import db from './../server/models'
import BaseTester from './BaseTester'
import ItemTester from './ItemTester'
import UserTester from './UserTester'

// Pre-app initializations
require('./../server/config')
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
    before(testCollectionsEmpty)

    itemTester.runAllTests()
    userTester.runAllTests()

    after(() => {
        process.exit(0)
    })
})


/*
 * DB Reset Tests
 */
function testCollectionsEmpty(done) {
    collections.forEach((collection) => {
        if (!isCollectionEmpty(collection)) {
            throw new Error('Failed to reset ' + collection.modelName)
        }
    })

    done()
}

async function isCollectionEmpty(collection) {
    const documents = await collection.find({}).exec()

    if (documents) {
        return false
    }

    return true
}