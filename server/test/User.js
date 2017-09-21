import chai from 'chai'
import chaiHttp from 'chai-http'

import BaseTester from './BaseTester'

const should = chai.should()
chai.use(chaiHttp)


class UserTester extends BaseTester {
    constructor(schema, app) {
        super(schema, app)

        this.testUser = require('./../../seeds/data/user').data[0]
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
        })
    }

    testValidSignup() {
        it('user should successfully signup', (done) => {
            chai.request(this.app)
                .post('/api/signup')
                .send(this.testUser)
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }

                    res.should.have.status(200)
                    this.schema.find({
                            'email': this.testUser.email
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

            chai.request(this.app)
                .post('/api/login')
                .send(this.testUser)
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }

                    res.should.have.status(200)

                    done()
                })
        })
    }
}

export default UserTester