const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const UserSchema = require('../../models/users');
const utils = require('../../../utils');
const validation = require('../../../validation');

let session = require('express-session');

const bcryptSaltRounds = 11;

const User = mongoose.model('user', UserSchema, 'users');

/**
 *
 * @param {Object} req - request
 * @param {Object} res - response
 * @returns {*} - Success response if the API is up
 */
exports.testApi = (req, res) => {
    return res.status(200).send({'response': 'success'});
};

/**
 *
 * @param {Object} req - request
 * @param {Object} req.body - request body
 * @param {string} req.body.email - Email address
 * @param {string} req.body.firstName - First name
 * @param {string} req.body.password - Password
 * @param {number} req.body.birthYear - Four digit birth year
 * @param {number} req.body.birthMonth - One or two digit birth month
 * @param {number} req.body.birthDay - One or two digit birth day
 * @param {Object} res - response
 * @returns {Promise<*>} - New user or array of errors
 */
exports.createUser = async (req, res) => {
    try {
        let errors = {};
        errors = await validation.validateRegBody(req.body);

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
                    req.session.userId = result._id;
                    res.status(201).send(result)
                })
                .catch(err => {
                    console.log(err);
                    res.status(200).send({'error': 'something_else'});
                });
        })
    } catch
        (error) {
        res.status(500).send({'error': 'something_else'});
    }
};

/**
 *
 * @param {Object} req - request
 * @param {Object} req.body - request body
 * @param {string} req.body.email - Email address
 * @param {string} req.body.password - Password
 * @param {Object} res - response
 * @returns {Promise<*>} - User profile or array or errors
 */
exports.loginUser = async (req, res) => {
    try {
        let errors = {};
        errors = await validation.validateLoginBody(req.body);

        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            return res.json({'errors': errors});
        }

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
        res.status(200).send({'error': 'something_else'});
    }
};
