const assert = require('assert');
const chai = require('chai');
const supertest = require('supertest');
const should = require('should');
const randStr = require('randomstring');


const server = supertest.agent('http://localhost:3000');

describe('TrackYourLift API', () => {
    describe('API is up', () => {
        it('should return 200', (done) => {
            // calling home page api
            server
                .get('/api')
                .expect(200) // THis is HTTP response
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    done();
                });
        });
    });

    describe('Create Users API', () => {
        it('should return 200', (done) => {
            let randEmail = randStr.generate(12) + '@example.com';
            // calling home page api
            server
                .post('/api/v1/users')
                .send({
                    email:  randEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17
                })
                .expect("Content-type",/json/)
                .expect(200) // THis is HTTP response
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('age').which.is.a.Number();
                    done();
                });
        });

        it('should return 500', (done) => {
            let randEmail = randStr.generate(12);
            // calling home page api
            server
                .post('/api/v1/users')
                .send({
                    email:  randEmail,
                    firstName: "John",
                    birthYear: 1980,
                    birthMonth: 1,
                    birthDay: 17
                })
                .expect("Content-type",/json/)
                .expect(500) // THis is HTTP response
                .end((err, res) => {
                    // HTTP status should be 500
                    res.status.should.equal(500);
                    done();
                });
        });

        it('should return existing user', (done) => {
            // calling home page api
            server
                .post('/api/v1/users/login')
                .send({
                    email:  'testuser@example.com',
                })
                .expect("Content-type",/json/)
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
                    email:  randEmail,
                })
                .expect("Content-type",/json/)
                .expect(200)
                .end((err, res) => {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    res.body.should.not.have.property('_id');
                    done();
                });
        });
    });
});
