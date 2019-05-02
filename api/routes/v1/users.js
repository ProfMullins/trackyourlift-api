const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserSchema = require('../../../models/users');
const utils = require('../../../utils');

const User = mongoose.model('user', UserSchema, 'users');

router.get('/test', (req, res) => {
    res.status(200).send({"response": "users api"});
});

router.post('/', async (req, res, next) => {
    try {
        let age = utils.getAgeFromBirthdate(req.body.birthYear, req.body.birthMonth, req.body.birthDay);
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