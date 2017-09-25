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
                this.testValidLogout()
                this.testInvalidLogout()
            })
        })
    }

    testValidSignup() {
        it('user should successfully signup', (done) => {
            this.__agent
                .post('/api/signup')
                .send(this.__testUser)
                .then((res) => {
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
                .catch((err) => {
                    done(err)
                })
        })
    }

    testValidLogin() {
        it('user should login', (done) => {
            this.__agent
                .post('/api/login')
                .send(this.__testUser)
                .then((res) => {
                    res.should.have.status(200)
                    done()
                })
                .catch((err) => {
                    done(err)
                })
        })
    }

    testValidLogout(shouldBeValid) {
        it('user should be able to logout', (done) => {
            this.__agent
                .post('/api/logout')
                .send()
                .then((res) => {
                    res.should.have.status(200)
                    done()
                })
                .catch((err) => {
                    done(err)
                })
        })
    }

    testInvalidLogout(shouldBeValid) {
        it('user should not be able to logout', (done) => {
            this.__agent
                .post('/api/logout')
                .send()
                .then((res) => {
                    done(new Error('Incorrect status'))
                })
                .catch((err) => {
                    done()
                })
        })
    }
}

export default UserTester