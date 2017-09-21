import db from './../models'
import seeds from './../../seeds'
import BaseTester from './BaseTester'
import ItemTester from './Item'
import UserTester from './User'
import app from './../app'

// Pre-app initializations
require('./../../config')


BaseTester.resetCollections()

const itemTester = new ItemTester(db.Item)
const userTester = new UserTester(db.User, app)

itemTester.runAllTests()
userTester.runAllTests()
