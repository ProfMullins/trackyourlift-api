const assert = require('assert');
const chai = require('chai');
const supertest = require('supertest');
const should = require('should');
const randStr = require('randomstring');


const server = supertest.agent('http://localhost:3000');

let testEmail;

describe('TrackYourLift API', () => {
    describe('API is up', () => {
        it('should return 200', (done) => {
            // calling home page api
            server
                .get('/api/v1/users/test')
                .expect(200) // THis is HTTP response
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    res.body.should.have.property('response').equals('success');
                    done();
                });
        });
    });

    describe('Create Users API', () => {
        it('should create user', (done) => {
            let randEmail = randStr.generate(12) + '@example.com';
            testEmail = randEmail;
            // calling home page api
            server
                .post('/api/v1/users')
                .send({
                    email: randEmail,
                    password: "Abcd1234!",
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17
                })
                .expect("Content-type", /json/)
                .expect(201) // THis is HTTP response
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(201);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('age').which.is.a.Number();
                    done();
                });
        });

        it('should fail to create dupe user', (done) => {
            // calling home page api
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    password: "Abcd1234!",
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17
                })
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error');
                    res.body.error.should.equal('something_else');
                    done();
                });
        });

        it('should return email error', (done) => {
            let randEmail = randStr.generate(12);
            // calling home page api
            server
                .post('/api/v1/users')
                .send({
                    email: randEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.email.should.be.an.Array();
                    res.body.errors.email[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on missing password', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: ""
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    done();
                });
        });

        it('should fail on password min length', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "Abcd12!"
                })
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('min');
                    done();
                });
        });

        it('should fail on password max length', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "Abcd12!1dgfh6hfdgjy65rghyrgde4tg7d"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('max');
                    done();
                });
        });

        it('should fail on password missing lowercase', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "ABCD1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('lowercase');
                    done();
                });
        });

        it('should fail on password missing uppercase', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('uppercase');
                    done();
                });
        });

        it('should fail on password missing digit', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "abcdAfghd!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('digits');
                    done();
                });
        });

        it('should fail on password missing special character', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "Abcd1234E"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('symbols');
                    done();
                });
        });

        it('should fail on space in password', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "Abcd 1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('spaces');
                    done();
                });
        });

        it('should fail on min birthYear', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1776,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on max birthYear', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 2103,
                    birthMonth: 1,
                    birthDay: 17,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on min birthMonth', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1994,
                    birthMonth: 0,
                    birthDay: 17,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on max birthMonth', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1981,
                    birthMonth: 16,
                    birthDay: 17,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on min birthDay', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1983,
                    birthMonth: 10,
                    birthDay: 0,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on max birthDay', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1981,
                    birthMonth: 7,
                    birthDay: 33,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on missing birthYear', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: '',
                    birthMonth: 7,
                    birthDay: 7,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on missing birthMonth', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1981,
                    birthMonth: '',
                    birthDay: 4,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });

        it('should fail on missing birthDay', (done) => {
            server
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    firstName: "John",
                    birthYear: 1981,
                    birthMonth: 7,
                    birthDay: '',
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.birthDate.should.be.an.Array();
                    res.body.errors.birthDate[0].should.equal('validation');
                    done();
                });
        });
    });

    describe('Login Users API', () => {
        it('should return existing user', (done) => {
            // calling home page api
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "Abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    res.body.firstName.should.equal('john');
                    done();
                });
        });

        it('should not find user', (done) => {
            let randEmail = randStr.generate(14) + '@example.com';
            // calling home page api
            server
                .post('/api/v1/users/login')
                .send({
                    email: randEmail,
                    password: 'Abcd1234!'
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    res.body.should.not.have.property('_id');
                    done();
                });
        });

        it('should fail on missing password', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: ""
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    done();
                });
        });

        it('should fail on password min length', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "Abcd12!"
                })
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('min');
                    done();
                });
        });

        it('should fail on password max length', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "Abcd12!1dgfh6hfdgjy65rghyrgde4tg7d"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('max');
                    done();
                });
        });

        it('should fail on password missing lowercase', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "ABCD1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('lowercase');
                    done();
                });
        });

        it('should fail on password missing uppercase', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "abcd1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('uppercase');
                    done();
                });
        });

        it('should fail on password missing digit', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "abcdAfghd!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('digits');
                    done();
                });
        });

        it('should fail on password missing special character', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "Abcd1234E"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('symbols');
                    done();
                });
        });

        it('should fail on space in password', (done) => {
            server
                .post('/api/v1/users/login')
                .send({
                    email: testEmail,
                    password: "Abcd 1234!"
                })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('errors');
                    res.body.errors.password.should.be.an.Array();
                    res.body.errors.password[0].should.equal('spaces');
                    done();
                });
        });
    });
});
