const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const usersRouter = require('./api/routes/v1/users');

const app = express();

// using the JSON body parser
app.use(require('body-parser').json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/users', usersRouter);

mongoose.connect(process.env.MONGODB_CONN, { useNewUrlParser: true });

app.use('/', function(req, res) {
    res.status(200).send('track your lift api works');
});
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
