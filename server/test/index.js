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


BaseTester.resetCollections()
const agent = chai.request.agent(app)

const itemTester = new ItemTester(db.Item)
const userTester = new UserTester(db.User, agent)
const basketTester = new BasketTester(db.Basket, agent)

itemTester.runAllTests()
userTester.runAllTests()
basketTester.runAllTests()
