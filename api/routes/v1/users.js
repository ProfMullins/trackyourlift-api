const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const UserSchema = require('../../../models/users');
const utils = require('../../../utils');
const validation = require('../../../validation');


const bcryptSaltRounds = 11;

const User = mongoose.model('user', UserSchema, 'users');

router.get('/test', (req, res) => {
    return res.status(200).send({'response': 'success'});
});

router.post('/', async (req, res, next) => {
    try {
        let errors = {};
        errors = await validation.validateBody(req.body);

        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            return res.json({'errors': errors});
        }

        let age = await utils.getAgeFromBirthdate(req.body.birthYear, req.body.birthMonth, req.body.birthDay);
        await bcrypt.hash(req.body.password, bcryptSaltRounds, (err, hash) => {
            if (err) {
                console.log("bcrypt hash error:", err);
                res.status(500).send(err);
            }

            let newUser = new User({
                'email': req.body.email,
                'firstName': req.body.firstName,
                'birthDate': req.body.birthYear + '-' + req.body.birthMonth + '-' + req.body.birthDay,
                'age': age,
                'password': hash
            });
            return newUser.save()
                .then(result => {
                    res.send(result)
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({'error': 'something_else'});
                });
        })
    } catch
        (error) {
        res.status(500).send(error);
    }
})
;

router.post('/login', async (req, res, next) => {
    try {
        let result = await User.findOne({'email': req.body.email});

        if (!result || !result['_id']) {
            return res.status(200).send({'error': { 'email': 'not_found'}});
        }

        bcrypt.compare(req.body.password, result.password, function(err, bcryptRes) {
            if (err) {
                return res.status(401).send({'error': { 'something': 'something_else'}});
            }
            else if (!bcryptRes) {
                return res.status(401).send({'error': { 'email': 'incorrect_password'}});
            }

            return res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
