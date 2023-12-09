const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')
const {validationResult} = require('express-validator')


const signup = async (req, res) => {
  try {
    console.log('signup started')
    // Validate the data inputted by the user
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ err: errors.array()[0].msg });
    }

    // Destructure the user data from the request body
    const { name, email, password } = req.body;

    // Create a new user instance
    const user = new User({ name, email, password });

    // Save the user data to the database
    const data = await user.save();

    // Respond with a success message and the saved data
    res.json({ message: 'User registration successful', data });
  } catch (err) {
    // Handle any errors that occur during the registration process
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ err: 'An error occurred during user registration' });
  }
};

//authenticate a user
function authenticateUser(req, res, next) {
  const token = req.header('Authorization'); // Assuming the token is passed in the 'Authorization' header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token using your secret key
    req.user = { _id: decoded._id }; // Set the user on the request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
}


//signin function
const signin = (req, res) => {

  const {email, password} = req.body;
  console.log('signin started', email, password)

  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: "Email was not found"
        });
      }

      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match"
        });
      }

      const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY);

      res.cookie('token', token, {expire: new Date() + 1 });

      const {_id, name, email} = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email
        }
      });
    })
    .catch(err => {
      console.error("error:", err)
      return res.status(500).json({
        error: "Internal server error"
      });
    });
};

//signout function
const signout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');

    // Send a JSON response indicating successful sign-out
    return res.json({
      message: "User signed out successfully"
    });
  } catch (error) {
    // Handle any errors that may occur during sign-out
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};


module.exports = { signup, authenticateUser, signin, signout}
