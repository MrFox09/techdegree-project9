const express = require('express');
const router = express.Router();
const User = require('../models').User;
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

/* Async Handler function to wrap each route. */

function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next);
      } catch(error){
        res.status(500).send(error);
      }
    };
  }


// Define the middleware function to authenticate the User

const authenticateUser = asyncHandler(async (req, res, next) => {
    let message = null;
  
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    
  
    // If the user's credentials are available...
    if (credentials) {
      // Attempt to retrieve the user from the data store
      // by their username (i.e. the user's "key"
      // from the Authorization header).

      // Search the user in the DB  
      const user = await User.findOne({
          where: {
            emailAddress: credentials.name
          }
      });      
     
  
      // If a user was successfully retrieved from the data store...
      if (user) {

        //compare the passwords

        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
  
        // If the passwords match...
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`);
          
  
          // Store the retrieved user object on the request object
          // so any middleware functions that follow this middleware function
          // will have access to the user's information.
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${credentials.name}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    // If user authentication failed...
    if (message) {
      console.warn(message);
      
  
      // Return a response with a 401 Unauthorized HTTP status code.
      res.status(401).json({ message: 'Access Denied' , errorMessage: message });
    } else {
      // Or if user authentication succeeded...
      // Call the next() method.
      next();
    }
  });




  
  // get and return the current User

  router.get('/api/users', authenticateUser,  (req,res) => {

    res.status(200);

    const user = req.currentUser;

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });
  
  });

    // get and return the current User

    router.post('/api/users', asyncHandler( async (req,res) => {

      //hash the user password

      req.body.password = bcryptjs.hashSync(req.body.password);

      //create a new User in the DB

      const newUser = await User.create({

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: req.body.password
        
      });

      res.location('/');
      res.status(201);
  
      
    }));





  module.exports = router;
  exports.authenticateUser = authenticateUser;