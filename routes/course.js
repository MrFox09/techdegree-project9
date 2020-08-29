const express = require('express');
const router = express.Router();
const user = require('./routes/user');

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

  // authenticateUser Method from the user.js file

  const authenticateUser = user.authenticateUser;


//returns a list of courses(including the user that owns each course)

router.get('/api/courses', asyncHandler( async (req,res => {

    



})));

//Returns the course (including the user that owns the course)

router.get('/api/courses/:id', asyncHandler( async (req,res => {



})));

//Creates a course, sets the Location header to the URI for the course and returns no content

router.post('/api/courses', asyncHandler( async (req,res => {



})));

// Updates a course and returns no content

router.put('/api/courses/:id', asyncHandler( async (req,res => {



})));

// Deletes a course and returns no content

router.delete('/api/courses/:id', asyncHandler( async (req,res => {



})));



module.exports = router;