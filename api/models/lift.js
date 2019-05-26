const mongoose = require('mongoose');
const validator = require('validator');
const setSchema = require('./set');

/**
 * liftSchema schema
 * @constructor Lift
 */
let liftSchema = new mongoose.Schema({
    liftName: {
        type: String,
        required: true,
        lowercase: true,
        validate: (value) => {
            return (validator.isLength(value, {min: 2, max: 50}))
        }
    },
    numSets: {
        type: Number,
        min: [1, 'too few'],
        max: 100
    },
    sets: {
        type: [setSchema]
    }
});

module.exports = liftSchema;
