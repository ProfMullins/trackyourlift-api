const mongoose = require('mongoose');
const validator = require('validator');


let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        validate: (value) => {
            return (validator.isAlpha(value) && validator.isLength(value, {min: 2, max: 50}))
        }
    },
    birthDate: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        min: [18, 'too young'],
        max: 100
    }
});

module.exports = userSchema;