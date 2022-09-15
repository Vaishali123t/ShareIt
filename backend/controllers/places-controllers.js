const fs= require('fs')

const { v4: uuidv4 } = require("uuid");
const { validator, validationResult } =require('express-validator')
const HttpError = require("../models/http-error");

const Place=require('../models/place');
const User= require('../models/users')

const url =
  "mongodb+srv://admin:Tp7ozLhmB71s7tMF@cluster0.fgal3tb.mongodb.net/places_test?retryWrites=true&w=majority";

const getCoordsForAddress=require('../util/location');
const { default: mongoose } = require("mongoose");


const getPlaceById = async (req, res, next) => {
  
  const placeId = req.params.pid;

  let place;
  try{
    place = await Place.findById( placeId );
  }catch(err){
    const error= new HttpError('Something went wrong. Could not find a place',501)
    console.log(error)
    return next(error)
  }

  if (!place) {
    return next(
      new HttpError("Could not find place with the provided id.", 404)
    );
  }
  console.log(place.toObject({getters:true}))
  res.json({ place: place.toObject({getters:true})});
};

const getPlacesByUserId = async (req, res, next) => {
  
  const userId = req.params.uid;

  let allPlaces;
  try{
    allPlaces = await Place.find( {creatorId:userId} );
  }catch(err){
    const error= new HttpError('Something went wrong. Could not find a place',500)
    return next(error)
  }
 
  if (!allPlaces.length) {
    return next(
      new HttpError("Could not find place with the provided userid.", 404)
    );
  }
    // res.json({ place: place.toObject({ getters: true }) });
  res.send({ places: allPlaces.map(p=> p.toObject({getters:true})) });
};

const createPlace = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next( new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates = getCoordsForAddress(address);

  const createdPlace = new Place({
    title,
    description,
    address,
    location:coordinates,
    image: req.file.path,
    creatorId:creator
  });

  let user;
  try{
    user = await User.findById(creator);
  }catch(err){
      const error = new HttpError(
        "Creating place failed. Please Try again.",
        500
      );
      return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find the user with this id.",
      404
    );
    return next(error);
  }

  try{
    const sess= await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session:sess})
    user.places.push(createdPlace)
    await user.save({session:sess})
    await sess.commitTransaction()

  } catch(err){
    const error= new HttpError(
      'Creating place failed. Please Try again.',500
    )
    return next(error);
  }

  res.status(201).json(createdPlace);
};

const editPlaceById= async (req,res,next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next( new HttpError(
      "Invalid inputs passed, please check your data",
      422
    ));
  }
  const placeid=req.params.pid;
  const { title, description} = req.body;

  let place;
  try{
    place = await Place.findById(placeid);
  }catch(err){
    const error = new HttpError(
      "Something went wrong. Could not find a place with this id",
      500
    );
    return next(error)
  }

  place.title = title;
  place.description = description;

  try{   
    await place.save();
  } catch(err){
    const error= new HttpError('Something went wrong. Could not update place.',500)
     return next(error);
  }
  res.status(200).json({ place: place.toObject({getters:true}) });

}

const deletePlaceById= async (req,res,next)=>{
  const placeId=req.params.pid;

  let place;
  try{
    place = await Place.findById(placeId).populate('creatorId');
  }catch(err){
    const error = new HttpError(
      "Something went wrong. Could not find a place with this id.",
      500
    );
    return next(error)
  }

  if(!place){
     return next(new HttpError('Could not find a place for the req place id',404));
  }

  const imagePath= place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creatorId.places.pull(place);
    await place.creatorId.save({session:sess})
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed. Please Try again.",
      500
    );
    return next(error);
  }

  try{
    await place.remove();
  }catch(err){
    const error= new HttpError('Something went wrong. Could not delte place.',500)
    return next(error);
  }

  fs.unlink(imagePath,(err)=>{
    console.log(err)
  })
  res.status(200).json({meesage:'place deleted'})
}

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.editPlaceById=editPlaceById;
exports.deletePlaceById = deletePlaceById;
