const express = require('express');
const router = express.Router();
const {Course, User} = require('../models');
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


  


//returns a list of courses(including the user that owns each course)

router.get('/api/courses', asyncHandler( async (req,res,next) => {

  const courses = await Course.findAll({
    attributes: ['id','title','description', 'estimatedTime', 'materialsNeeded'],
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id','firstName','lastName', 'emailAddress']
      }    
    ]
  });

  if (courses) {
    res.json(courses);  
    
  } else {
    const err = new Error ();
    next(err);
    
  }

}));

//Returns the course (including the user that owns the course)

router.get('/api/courses/:id', asyncHandler( async (req,res,next) => {

  const course = await Course.findOne({
    attributes: ['id','title','description', 'estimatedTime', 'materialsNeeded'],
    where: {
      id: req.params.id

    },

    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id','firstName','lastName', 'emailAddress']
      }    
    ]
  });

  if (course) {
    res.json(course);
    
  } else {
    console.log('error');
    const err = new Error ();
    err.message = "Course not found";
    next(err);
    
  }    

  }));



//Creates a course, sets the Location header to the URI for the course and returns no content

router.post('/api/courses',authenticateUser, asyncHandler( async (req,res) => {
  // the user from the authentication method
  const user = req.currentUser;

  try {
    const newCourse = await Course.create({
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded,
      userId: user.id || req.body.userId  // takes the user-id from the logged in user or sending the userid with request
    });
  
    res.location(`/api/courses/${newCourse.id}`);
    res.status(201).end();
    
  } catch (error) {
    if(error.name === "SequelizeValidationError") {      
      res.status(400).json(error);           
    } else {
      throw error;
    }
    
  } 

}));



// Updates a course and returns no content

router.put('/api/courses/:id', authenticateUser, asyncHandler( async (req,res,next) => {
  //save the current Users id (from the authenticateUser Method)
  currentUser = req.currentUser.id;
  let course;
  try {
    course = await Course.findByPk(req.params.id);
    

    if(course && currentUser === course.userId) {        
      

      await course.update(req.body);

      // check the body if it is empty, send a validation error when empty

      if (isEmpty(req.body)) {
        const err = new Error ();
        err.status = 400;
        res.status(400);
        err.message = 'Validation Error, Can not be empty';
        next(err);
        
        
      } else {      

        res.status(204).end();    
        
      }

      //throw an error when you don't own the course
      
    } else {
      const err = new Error ();
      err.status = 403;
      res.status(403);
      err.message = 'Can not update! You do not own the course';
      next(err);
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

// Deletes a course and returns no content

router.delete('/api/courses/:id', authenticateUser, asyncHandler( async (req,res,next) => {

  //save the current Users id (from the authenticateUser Method)
  currentUser = req.currentUser.id;

  const course = await Course.findByPk(req.params.id);

  if(course && currentUser === course.userId){
    await course.destroy();
    res.status(204).end();
  }else {
    if (!course) {
      const err = new Error ();
      err.message = "Can't delete, course don't exists";
      next(err);
      
    } else {

      const err = new Error ();
      err.status = 403;
      res.status(403);
      err.message = "You don't have the permission to delete this course";
      next(err);
      
    }
  
    
  }

}));



module.exports = router;