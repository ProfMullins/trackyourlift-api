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
    return res.status(200).send({"response": "users api"});
});

router.post('/', async (req, res, next) => {
    try {
        let errors = {};
        errors = await validation.validateBody(req.body);

        if (errors['email'].length > 0 || errors['firstName'].length > 0 || errors['password'].length > 0 || errors['birthDate'].length > 0) {
            return res.json({'errors': errors});
        }

        let hashedPassword;
        await bcrypt.hash(req.body.password, bcryptSaltRounds, (err, hash) => {
            if (err) {
                console.log("bcrypt hash error:", err);
                res.status(500).send(err);
            }

            hashedPassword = hash;
        });

        let age = await utils.getAgeFromBirthdate(req.body.birthYear, req.body.birthMonth, req.body.birthDay);
        let newUser = new User({
            'email': req.body.email,
            'firstName': req.body.firstName,
            'birthDate': req.body.birthYear + '-' + req.body.birthMonth + '-' + req.body.birthDay,
            'age': age
        });
        let result = await newUser.save();

        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        let result = await User.findOne({'email': req.body.email});
        console.log(result);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
