const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('../authenticateUser');

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

// Helper Function which will check if an object is empty returns true if it is or false if not

const isEmpty = (obj) => {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
};
  
  // get and return the current User

  router.get('/api/users', authenticateUser,  (req,res) => {

    res.status(200);

    //store the current user from the authenticatUser method in a variable
    const user = req.currentUser;

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });
  
  });

    //Creates a user, sets the Location header to "/" and returns no content

    router.post('/api/users', asyncHandler( async (req,res,next) => {

     

     
      try {
        // check the body if it is empty, send a validation error when empty

        if (isEmpty(req.body)) {
          const err = new Error ();
          err.status = 400;
          res.status(400);
          err.message = 'Validation Error, Can not be empty';
          next(err);
          
        } else {

           //hash the user password

            req.body.password = bcryptjs.hashSync(req.body.password);

           //create a new User in the User-DB
            await User.create({

            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
          
          });
  
          res.location('/');
          res.status(201).end();
          
        }        


        // throw an error when enter invalid data
      } catch (error) {
        if(error.name === "SequelizeValidationError") {      
          res.status(400).json(error);           
        } else {
          throw error;
        }
        
      } 
  
      
    }));


  module.exports = router;
  