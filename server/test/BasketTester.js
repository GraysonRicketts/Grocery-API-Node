import chai from 'chai'

import db from './../models'
import BaseTester from './BaseTester'

const should = chai.should()


class BasketTester extends BaseTester {
    runAllTests() {
        this.testCollectionSize(1)
        this.testGettingNothing()
        this.testAddingAnItem()
        // this.testGettingOneItem()
    }

    testGettingNothing() {
        it ('should get no items', (done) => {
            this.login().then(() => {
                this.__agent.get('/api/basket')
                .send()
                .then((res) => {
                    if (res.body.success === false) {
                        done('Failed to get basket')
                    }

                    res.body.basket.items.length.should.be.eql(0)
                    done()
                })
                .catch((err) => {
                    done(err)
                })
            })
            .catch((err) => {
                done(err)
            })
        })
    }

    testAddingAnItem() {
        it('should add an item', (done) => {
            let items = {
                delta: {}
            }
            items.delta.newItems = []

            items.delta.newItems.push({
                itemDef: {
                    title: 'salmon'
                },
                quantity: 2,
                size: '6 oz'
            })

            this.__agent.post('/api/basket')
                .send(items)
                .then((res) => {
                    res.status.should.be.eql(200)
                    done()
                })
                .catch((err) => {
                    done(err)
                })
        })
    }

    testGettingOneItem() {
        it ('should get 1 items', (done) => {
            this.login().then(() => {
                this.__agent.get('/api/basket')
                .send()
                .then((res) => {
                    if (res.body.success === false) {
                        done('Failed to get basket')
                    }

                    res.body.basket.items.length.should.be.eql(1)
                    // res.body.basket.items[0].itemDef.
                    done()
                })
                .catch((err) => {
                    done(err)
                })
            })
            .catch((err) => {
                done(err)
            })
        })
    }

    login() {
        return this.__agent.post('/api/login').send(this.__testUser)
    }
}

export default BasketTester