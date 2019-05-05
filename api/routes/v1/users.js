const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/users');

router.get('/test', userController.testApi);

router.post('/', userController.createUser);

router.post('/login', userController.loginUser);

module.exports = router;
