import db from './../server/models'

import Seeder from './Seeder'


const ItemSeeder = new Seeder(db.Item, './data/items')
const UserSeeder = new Seeder(db.User, './data/user')

export default({
    ItemSeeder,
    UserSeeder
})