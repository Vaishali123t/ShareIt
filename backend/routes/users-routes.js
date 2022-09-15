const express = require("express");
const {check} = require('express-validator')   // for validating

const usersControllers= require('../controllers/users-controller')
const fileUpload= require('../middleware/file-upload')

const router = express.Router();


// find all users
router.get("/", usersControllers.getAllUsers);

// find a user by uid
router.get("/:uid", usersControllers.getUserById);

// signup
router.post(
  "/signup",
  fileUpload.single('image'),
  [check("name").not().isEmpty(), check("email").normalizeEmail().isEmail(), check('password').isLength({min:6})],
  usersControllers.signUp
);

//login
router.post("/login", usersControllers.login);

module.exports = router;
