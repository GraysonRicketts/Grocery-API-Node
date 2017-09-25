import db from './../models'
import seeds from './../../seeds'
import BaseTester from './BaseTester'
import ItemTester from './ItemTester'
import UserTester from './UserTester'
import BasketTester from './BasketTester'
import app from './../app'

// Pre-app initializations
require('./../../config')


BaseTester.resetCollections()

const itemTester = new ItemTester(db.Item)

const agent = chai.request.agent(app)
const userTester = new UserTester(db.User, agent)
const BasketTester = new BasketTester(db.Basket, agent)

itemTester.runAllTests()
userTester.runAllTests()
