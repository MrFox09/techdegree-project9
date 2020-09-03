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

  


//returns a list of courses(including the user that owns each course)

router.get('/api/courses', authenticateUser, asyncHandler( async (req,res) => {

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

  if (course) {
    res.json(courses);  
    
  } else {
    const err = new Error ();
    next(err);
    
  }

}));

//Returns the course (including the user that owns the course)

router.get('/api/courses/:id', authenticateUser, asyncHandler( async (req,res) => {

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
    const err = new Error ();
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
      res.status(400);           
    } else {
      throw error;
    }
    
  } 

}));

// Updates a course and returns no content

router.put('/api/courses/:id', authenticateUser, asyncHandler( async (req,res) => {

  let course;
  try {
    course = await Course.findByPk(req.params.id);

    if(course) {
      await course.update(req.body);
      res.status(204).end(); 
    } else {
      const err = new Error ();
      next(err);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {      
      res.status(400);           
    } else {
      throw error;
    }
  }
}));

// Deletes a course and returns no content

router.delete('/api/courses/:id', authenticateUser, asyncHandler( async (req,res) => {

  const course = await Course.findByPk(req.params.id);

  if(course){
    await course.destroy();
    res.status(204).end();
  }else {
    const err = new Error ();
    next(err);
    
  }

}));



module.exports = router;