import BaseTester from './BaseTester'


class ItemTester extends BaseTester {
    runAllTests() {
        describe('Item', () => {
            this.setupDb()
        })
    }
}

export default ItemTester