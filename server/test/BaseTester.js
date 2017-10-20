class BaseTester {
    constructor(schema, agent) {
        this.__schema = schema
        this.__agent = agent
        this.__testUser = require('./../../seeds/data/user').testUser
    }
}

export default BaseTester