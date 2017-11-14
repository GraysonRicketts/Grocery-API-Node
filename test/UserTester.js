import chai from 'chai'

import User from './../server/models/User'
import BaseTester from './BaseTester'
import BasketTester from './BasketTester'

const should = chai.should()


class UserTester extends BaseTester {
    constructor(agent) {
        super(User, agent)
    }

    runAllTests() {
        const basketTester = new BasketTester(this.__agent)
        
        describe('User', () => {
            // Signup
            this.testValidSignup()
            this.testInvalidSignup()
    
            // Login
            this.testValidLogin()
            this.testWrongPasswordLogin()
            this.testNonExistentEmailLogin()
            this.testPasswordHashed()
    
            // Logout
            this.testValidLogout()
            this.testInvalidLogout()

            basketTester.runAllTests()
        })
    }

    testValidSignup() {
        it('should successfully signup', (done) => {
            this.__agent.post('/api/signup')
                .send(this.__testUser)
                .then((res) => {
                    res.should.have.status(200)
                    this.__schema.find({
                            'email': this.__testUser.email
                        })
                        .then((documents) => {
                            documents.length.should.be.eql(1)
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

    testInvalidSignup() {
        it('should not successfully signup', (done) => {
            this.__agent.post('/api/signup')
                .send(this.__testUser)
                .then((res) => {
                    done(new Error('User should not have been able to signup'))
                })
                .catch((err) => {
                    this.__schema.find()
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
        it('should login', (done) => {
            this.__agent.post('/api/login')
                .send(this.__testUser)
                .then((res) => {
                    res.should.have.status(200)
                    // TODO: test basket created
                    
                    done()

                    this.testPasswordHashed()
                })
                .catch((err) => {
                    done(err)
                })
        })
    }

    testWrongPasswordLogin() {
        it('should not be able to login with wrong password', (done) => {
            let badUser = {}
            badUser.email = this.__testUser.email
            badUser.password = 'this is the wrong password'

            this.__agent.post('/api/login')
                .send(badUser)
                .then((res) => {
                    done(new Error('Should not be able to login with wrong password'))
                })
                .catch((err) => {
                    done()
                })
        })
    }

    testNonExistentEmailLogin() {
        it('should not be able to login with non-existent user', (done) => {
            let badUser = {}
            badUser.email = 'thisEmail@doesnotexist.com'
            badUser.password = 'this is the wrong password'

            this.__agent.post('/api/login')
                .send(badUser)
                .then((res) => {
                    done(new Error('Should not be able to login with non-existent user'))
                })
                .catch((err) => {
                    done()
                })
        })
    }

    testPasswordHashed() {
        it('password should be hashed', (done) => {
            this.__schema.find({ email: this.__testUser.email})
                .then((user) => {
                    if (user.password !== this.__testUser.password) {
                        done()
                    } else {
                        done(new Error('Password is not hashed'))
                    }
                })
                .catch((err) => {
                    done(err)
                })
        })
    }

    testValidLogout() {
        it('should be able to logout', (done) => {
            this.__agent.post('/api/logout')
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

    testInvalidLogout() {
        it('should not be able to logout', (done) => {
            this.__agent.post('/api/logout')
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