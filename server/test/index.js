import db from './../models'
import seeds from './../../seeds'
import ItemTester from './Item'
import UserTester from './User'

// Pre-app initializations
require('./../../config')


const itemTester = new ItemTester(db.Item, seeds.ItemSeeder, 7)
const userTester = new UserTester(db.User, seeds.UserSeeder, 1)

itemTester.runAllTests()
userTester.runAllTests()
