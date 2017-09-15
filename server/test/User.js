import BaseTester from './BaseTester'


class UserTester extends BaseTester {
    runAllTests() {
        describe('Item', () => {
            this.setupDb()
        })
    }
}

export default UserTester