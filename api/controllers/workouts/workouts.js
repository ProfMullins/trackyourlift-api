const express = require('express');
const mongoose = require('mongoose');
const WorkoutSchema = require('../../models/workouts');
const LiftSchema = require('../../models/lift');
const SetSchema = require('../../models/set');
const utils = require('../../../utils');
const validation = require('../../../validation');

const Workout = mongoose.model('workout', WorkoutSchema, 'workouts');
const Lift = mongoose.model('lift', LiftSchema, 'lifts');
const Set = mongoose.model('set', SetSchema, 'sets');

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
 * @param {string} req.body.workoutName - Name of workout
 * @param {number} req.body.year - Four digit year
 * @param {number} req.body.month - One or two digit month
 * @param {number} req.body.day - One or two digit data
 * @param {Object} req.session - request session
 * @param {string} req.session.userId - User ID
 * @param {Object} res - response
 * @returns {Promise<Promise<any | * | *>|*>} - New workout or array of errors
 */
exports.createWorkout = async (req, res) => {
    try {
        let errors = {};
        errors = await validation.validateWorkout(req.body);

        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            return res.json({'errors': errors});
        }

        let newWorkout = new Workout({
            'userId': mongoose.Types.ObjectId(req.session.userId),
            'workoutName': req.body.workoutName,
            'date': req.body.year + '-' + req.body.month + '-' + req.body.day
        });

        return newWorkout.save()
            .then(result => {
                req.session.workoutId = result._id;
                res.status(201).send(result)
            })
            .catch(err => {
                console.log(err);
                res.status(200).send({'error': 'something_else'});
            });
    }
    catch (e) {
        console.log(e);
    }
};

/**
 *
 * @param {Object} req - request
 * @param {Object} req.body - request body
 * @param {string} req.body.liftName - Name of the lift
 * @param {number} req.body.numSets - Number of sets performed or performing
 * @param {Object} res - response
 * @returns {Promise<Promise<any | * | *>|*>} - New lift or array of errors
 */
exports.createLift = async (req, res) => {
    try {
        let errors = {};
        errors = await validation.validateLift(req.body);

        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            return res.json({'errors': errors});
        }

        let newLift = new Lift({
            'liftName': req.body.liftName,
            'numSets': req.body.numSets
        });

        return newLift.save()
            .then(result => {
                req.session.liftId = result._id;
                res.status(201).send(result)
            })
            .catch(err => {
                console.log(err);
                res.status(200).send({'error': 'something_else'});
            });
    }
    catch (e) {
        console.log(e);
    }
};

/**
 *
 * @param {Object} req - request
 * @param {Object} req.body - request body
 * @param {number} req.body.weight - Weight lifted
 * @param {number} req.body.reps - Number of reps performed in the set
 * @param {Object} res - response
 * @returns {Promise<*>} - New set or array of errors
 */
exports.fetchOrCreateSet = async (req, res) => {
    try {
        let errors = {};
        errors = await validation.validateSet(req.body);

        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            return res.json({'errors': errors});
        }

        let query = Set.where({weight: req.body.weight, reps: req.body.reps});

        await query.findOne(function (err, set) {
            if (err) {
                console.log(err);
                // TODO: Better error handling
                return;
            }
            if (set) {
                if (!set._id) { // create a new set
                    let newSet = new Set({
                        'weight': req.body.weight,
                        'reps': req.body.reps
                    });

                    return newSet.save()
                        .then(result => {
                            saveSetToLift(result, req.session.liftId);
                            res.status(201).send(result)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(200).send({'error': 'something_else'});
                        });
                }
                else {
                    saveSetToLift(set, req.session.liftId);
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};

/**
 *
 * @param {Object} set - Set
 * @param {string} liftId - ID for the associated lift
 * @returns {{}} - Updated lift object or empty object
 */
function saveSetToLift(set, liftId) {
    if (mongoose.Types.ObjectId.isValid(liftId)) {
        Lift.findOneAndUpdate({_id: mongoose.Types.ObjectId(liftId)},{$push: { sets: set }},{ new:true })
            .then((lift) => {
                if (lift) {
                    return lift;
                }
                else {
                    return {};
                }
            })
            .catch((err) => {
                return {};
        });
    }
    else {
        return {};
    }
}

/**
 *
 * @param {Object} lift - Lift
 * @param {string} workoutId - ID of workout
 * @returns {{}} - Updated workout object or empty object
 */
function saveLiftToWorkout(lift, workoutId) {
    if (mongoose.Types.ObjectId.isValid(workoutId)) {
        Lift.findOneAndUpdate({_id: mongoose.Types.ObjectId(workoutId)},{$push: { lifts: lift }},{ new: true })
            .then((workout) => {
                if (workout) {
                    return workout;
                }
                else {
                    return {};
                }
            })
            .catch((err) => {
                return {};
            });
    }
    else {
        return {};
    }
}
