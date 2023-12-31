const User = require('../models/user')
const Task = require('../models/task')
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


// Function to create a new task for a user
const createTask = async (req, res) => {
  try {
    // Extract user input from the request body
    const { user, title, description, dueDate } = req.body;

    // Create a new task using the Task model
    const newTask = new Task({
      user,
      title,
      description,
      dueDate,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    res.status(201).json({ success: true, task: savedTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Function to get a list of tasks for a user
const getTasksForUser = async (req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.user._id;

    // Fetch tasks for the specified user
    const tasks = await Task.find({ user: userId });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Function to update details of a user's task
const updateTaskDetails = async (req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.user._id;

    // Extract task ID and updated details from the request body
    const { taskId, updatedDetails } = req.body;

    // Find and update the task by ID and user ID
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: updatedDetails },
      { new: true }
    );

    if (!updatedTask) {
      // Task not found or user does not have permission to update the task
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



// Function to delete a user's task
const deleteTask = async (req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.user._id;

    // Extract task ID from the request parameters
    const taskId = req.params.taskId;

    // Find and delete the task by ID and user ID
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!deletedTask) {
      // Task not found or user does not have permission to delete the task
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Function to update the status of a user's task
const updateTaskStatus = async (req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.user._id;

    // Extract task ID and updated status from the request body
    const { taskId, status } = req.body;

    // Validate that the provided status is either 'Pending' or 'Completed'
    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Find and update the task by ID and user ID
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: { status } },
      { new: true }
    );

    if (!updatedTask) {
      // Task not found or user does not have permission to update the task
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports = { signup, authenticateUser, signin, signout, createTask, getTasksForUser, updateTaskDetails, deleteTask, updateTaskStatus}
