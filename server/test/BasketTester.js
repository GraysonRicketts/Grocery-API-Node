import chai from 'chai'

import db from './../models'
import BaseTester from './BaseTester'

const should = chai.should()


class BasketTester extends BaseTester {
    async runAllTests() {
        this.testCollectionSize(1)
        this.testGettingNothing()
        this.testAddingAnItem()
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
            let request = {
                delta: {}
            }
            request.delta.newItems = []

            request.delta.newItems.push({
                title: 'salmon'
            })

            this.__agent.post('/api/basket')
                .send(request)
                .then((res) => {
                    res.basket.length.should.be.eql(1)
                    done()
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