const {User} = require('./models');
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

  // Define the middleware function to authenticate the User and export it to use it in other routes

  module.exports = asyncHandler(async (req, res, next) => {
    let message = null;
  
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    
  
    // If the user's credentials are available...
    if (credentials) {

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
      next();
    }
  });