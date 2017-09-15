import BaseTester from './BaseTester'


class UserTester extends BaseTester {
    runAllTests() {
        describe('User', () => {
            this.setupDb()
        })
    }
}

export default UserTester