const express = require("express");
const router = express.Router();
// provide middleware for handling multipart/form-data primarily used for uploading files
const multer = require("multer");
const AWS = require("aws-sdk");
const paramsConfig = require("../utils/params-config");

// create temp storage container that will hold the image files until it is ready to be uploaded to the S3 bucket
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

// upload constant contains the storage destination and the key: image
const upload = multer({ storage }).single("image");

// instantiate service object, s3, to communicate w/ S3 web service
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

// image upload route
  router.post("/image-upload", upload, (req, res) => {
    // use imported config to make web service all to upload image to S3 bucket
    const params = paramsConfig(req.file);
    // use s3 service interface object to call the upload() method
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      res.json(data);
    });
  });

  module.exports = router

// UPLOAD CONST EXPLAINED:
// We'll use the preceding function, upload, to store the image data from the form data received by the POST route. We'll use the single method to define that this upload function will receive only one image. We'll also define the key of the image object as image.
