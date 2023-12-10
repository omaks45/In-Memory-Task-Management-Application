const express = require('express')
const {signup, authenticateUser, signin, signout, createTask, getTasksForUser, updateTaskDetails, deleteTask, updateTaskStatus} = require('../controller/user')
const router = express.Router()
const {check} = require('express-validator')


router.post('/signup',  [
  check("name", "Name atleast should be 3 characters").isLength({min: 3}),
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 6 characters").isLength({min: 6}),
] ,signup)

router.post('/login', [
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 6 characters").isLength({min: 6}),
], signin)


router.get('/signout', signout)

//task creation route
router.post('/createTask', authenticateUser, createTask)

// view of available task list 
 router.get('/view', authenticateUser, getTasksForUser)


 //task update
 router.put('/update', authenticateUser, updateTaskDetails)

 //task delete
  router.delete('/delete/:taskId', authenticateUser, deleteTask)

  //task status update
  router.patch('/updateStatus', authenticateUser, updateTaskStatus)
  
module.exports = router
