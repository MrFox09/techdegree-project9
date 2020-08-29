'use strict';

// load modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./models/index');
const routes = require('./routes');
const course = require('./routes/course');
const user = require('./routes/user');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// make sure that the res object is converted from json and accessable
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// the app can use the routes we require
app.use('/', routes,course,user);





// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
let port = app.set('port', process.env.PORT || 5000);

// start listening on our port and sync with the Database everytime the server gets started

db.sequelize
 .sync()
 .then(function() {
  const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
  });
}
);
