const express = require("express");
const {check} = require('express-validator')   // for validating

const placesControllers=require('../controllers/places-controllers')
const fileUpload= require('../middleware/file-upload')

const router= express.Router();

// get a specific place by id
router.get('/:pid',placesControllers.getPlaceById)

// retrieve list of all places for a given uid
router.get('/user/:uid',placesControllers.getPlacesByUserId)

router.post(
  "/",
  fileUpload.single('image'),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.editPlaceById
);

router.delete("/:pid",placesControllers.deletePlaceById)

module.exports =router;


