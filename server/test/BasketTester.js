import chai from 'chai'

import db from './../models'
import Basket from './../models/Basket'
import BaseTester from './BaseTester'

const should = chai.should()


class BasketTester extends BaseTester {
    constructor(agent) {
        super(Basket, agent)
    }

    runAllTests() {
        describe('Basket', () => {
            before((done) => {
                this.__agent.post('/api/login').send(this.__testUser)
                    .then(() => {
                        done()
                    })
                    .catch((err) => {
                        done(err)
                    })
            })

            this.testGettingNothing()
            this.testAddingAnItem()
            this.testGettingOneItem()
        })  
    }

    testGettingNothing() {
        it ('should get no items', (done) => {
            this.__agent.get('/api/basket')
                .send()
                .then((res) => {
                    if (res.body.success === false) {
                        done('Failed to get basket')
                    }

                    // Checks
                    res.body.basket.items.length.should.be.eql(0)

                    done()
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
                    // Checks
                    res.status.should.be.eql(201)

                    done()
                })
                .catch((err) => {
                    done(err)
                })
        })
    }

    testGettingOneItem() {
        it ('should get 1 item', (done) => {
            this.__agent.get('/api/basket')
                .send()
                .then((res) => {
                    if (res.body.success === false) {
                        done('Failed to get basket')
                    }

                    const items = res.body.basket.items

                    // Checks
                    items.length.should.be.eql(1)
                    items[0].quantity.should.be.eql(2)
                    items[0].itemDef.title.should.be.eql('salmon')

                    done()
                })
                .catch((err) => {
                    done(err)
                })
            })
    }
}

export default BasketTester