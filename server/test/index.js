import db from './../models'
import seeds from './../../seeds'
import ItemTest from './Item'
import UserTester from './User'

// Pre-app initializations
require('./../../config')

const userTester = new UserTester(db.User, seeds.UserSeeder, 1)

ItemTest.runAllTests()
userTester.runAllTests()
