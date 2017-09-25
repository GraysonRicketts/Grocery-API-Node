import chai from 'chai'

import BaseTester from './BaseTester'

const should = chai.should()


class UserTester extends BaseTester {
    constructor(schema, app) {
        super(schema, app)

        this.__testUser = require('./../../seeds/data/user').data[0]
    }

    runAllTests() {
        describe('User', () => {
            this.testCollectionEmpty()
            
            describe('Signup', () => {
                this.testValidSignup()
            })

            describe('Login', () => {
                this.testValidLogin()
            })

            describe('Logout', () => {
                this.testLogout(true)
                this.testLogout(false)
            })
        })
    }

    testValidSignup() {
        it('user should successfully signup', (done) => {
            this.__agent
                .post('/api/signup')
                .send(this.__testUser)
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }

                    res.should.have.status(200)
                    this.__schema.find({
                            'email': this.__testUser.email
                        })
                        .then((documents) => {
                            documents.length.should.be.eql(1)
                        })
                        .catch((err) => {
                            done(err)
                        })

                    done()
                })
        })
    }

    testValidLogin() {
        it('user should login', (done) => {
            this.__agent
                .post('/api/login')
                .send(this.__testUser)
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }

                    res.should.have.status(200)
                    done()
                })
        })
    }

    testLogout(shouldBeValid) {
        let testMsg = 'user should '
        if (!shouldBeValid) {
            testMsg += 'not '
        }
        testMsg += 'be able to logout'

        it(testMsg, (done) => {
            this.__agent
                .post('/api/logout')
                .send()
                .end((err, res) => {
                    if (err) {
                        if (res.status === 401) {
                            done()
                        } else {
                            done(err)
                        }
                    }

                    res.should.have.status(200)
                    done()
                })
        })
    }
}

export default UserTester