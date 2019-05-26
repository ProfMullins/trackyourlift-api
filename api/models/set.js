const mongoose = require('mongoose');
const validator = require('validator');


let setSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: true,
        min: 0.5,
        max: 3000
    },
    reps: {
        type: Number,
        min: 1,
        max: 100
    }
});

module.exports = setSchema;
