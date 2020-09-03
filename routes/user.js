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

    router.post('/api/users', asyncHandler( async (req,res) => {

      //hash the user password

      req.body.password = bcryptjs.hashSync(req.body.password);

      try {

        //create a new User in the User-DB

        await User.create({

          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailAddress: req.body.emailAddress,
          password: req.body.password
        
        });

        res.location('/');
        res.status(201).end();
        
      } catch (error) {

        if(error.name === "SequelizeValidationError") {      
          res.status(400).json(error);           
        } else {
          throw error;
        }
        
      }      
  
      
    }));


  module.exports = router;
  