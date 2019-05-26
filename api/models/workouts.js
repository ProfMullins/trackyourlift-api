const mongoose = require('mongoose');
const validator = require('validator');
const liftSchema = require('./lift');
let session = require('express-session');

/**
 * workoutsSchema schema
 * @constructor Workouts
 */
let workoutsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        unique: false
    },
    workoutName: {
        type: String,
        required: true,
        lowercase: true,
        validate: (value) => {
            return (validator.isLength(value, {min: 2, max: 50}))
        }
    },
    date: {
        type: Date,
        required: true
    },
    lifts: {
        type: [liftSchema]
    }
});

module.exports = workoutsSchema;
