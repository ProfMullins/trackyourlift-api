const express = require('express');
const router = express.Router();
const workoutsController = require('../../controllers/workouts/workouts');

router.get('/test', workoutsController.testApi);

router.post('/', workoutsController.createWorkout);

router.post('/lift', workoutsController.createLift);

router.post('/set', workoutsController.fetchOrCreateSet);

module.exports = router;
