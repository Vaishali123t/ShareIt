const { json } = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { validator, validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User= require('../models/users')


const getAllUsers = async (req, res, next) => {
  let users;
  try{
    users= await User.find({},'-password')
  }catch(err){
      const error = new HttpError("Fetching users failed. Please try again.", 500);
      return next(error);
  }
  
  res.status(200).json({users:users.map(u=>u.toObject({getters:true}))});
};

const getUserById = async (req, res, next) => {

  const userId = req.params.uid;

  let hasUser;
  try{
    hasUser= await User.findById(userId);
  }catch(err){
      const error = new HttpError(
        "Some issue occured. Please try again.",
        500
      );
      return next(error);
  }

  if(!hasUser){
    return next(new HttpError("User not found.",404))
  }

  res.json({ user: hasUser });
};

const signUp = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      console.log(errors);
      return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

  const { name, email, password } = req.body;

  let hasUser;
  try{
    hasUser= await User.findOne({email:email});
  }catch(err){
      const error = new HttpError(
        "Signing up failed. Please try again.",
        500
      );
      return next(error);
  }

  if(hasUser){
    return next( new HttpError("Could not create user. Email Already exists!",422))
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places:[]
  });

  try{
    await createdUser.save();
  }catch(err){
    const error = new HttpError("Signing up failed. Please try again..", 500);
    return next(error);
  }

  res.status(201).json({user:createdUser.toObject({getters:true})});

};

const login = async (req, res, next) => {

   const { email, password } = req.body;

  let hasUser;
  try{
    hasUser= await User.findOne({email:email});
  }catch(err){
      const error = new HttpError(
        "Logging in failed. Please try again.",
        500
      );
      return next(error);
  }

  if(!hasUser || hasUser.password!==password){
      const error = new HttpError("Logging in failed. Invalid credentials.", 500);
      return next(error);
  }

  res.status(200).json(
    {message:"Logged In",
    user:hasUser.toObject({getters:true})})
};

exports.getUserById = getUserById;
exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
