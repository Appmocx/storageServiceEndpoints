var express = require("express");
var s3 = require("storageservice").S3Storage;
var f = require("storageservice");
var router = express.Router();
var env = require('dotenv').config();

const bucketOptions = {
  bucketName:process.env.bucket_name,
  accessKeyId: process.env.access_key_id,
  secretAccessKey:  process.env.secret_access_key,
};
// console.log(process.env.access_key_id)
const s3Obj = new s3(bucketOptions);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/file", async function (req, res, next) {
  const uploadedFile = req.files.file;
  const file = {
    name: uploadedFile["name"],
    size: uploadedFile["size"],
    type: uploadedFile["mimetype"],
    content: uploadedFile["data"],
    extension: "png",
  };
  // console.log("file",req.body)
  if(req.body.folder){
    file['name'] =req.body.folder + "/"+  uploadedFile["name"]
  }
  const opt = {
    acl: "public-read",
  };
  // console.log("file",file)
  const upload = await s3Obj.uploadFileObject(file, opt);
  res.send(upload);
});

router.post("/getAllFile", async function (req, res, next) {
  let data = {
    prefix:req.body.prefix,
    file:req.body.file ,
    folder:req.body.folder 
  }

 
  const getAllObj = await s3Obj.getFileContent(data).catch((err)=>{console.log("err",err)})
  res.send( getAllObj);
});

router.post("/downloadFile", async function (req, res, next) {
  let params = {
    key: req.body.key,
  };
  const downloadFile = await s3Obj.downloadFile(params);

  res.send(downloadFile);
});

router.post("/deleteFile", async function (req, res, next) {
  let params = {
    key: req.body.key,
  };
  const deleteFile = await s3Obj.deleteFile(params);

  res.send(deleteFile);
});

router.post("/createFolder", async function (req, res, next) {
  let folderPath =  req.body.key +"/"
  let params = {
    key: folderPath,
  };
  const createFolder = await s3Obj.createFolder(params);

  res.send(createFolder);
});

router.post("/getFolderContent", async function (req, res, next) {
  let folderPath =  req.body.key +"/"
  let params = {
    folderPath: folderPath,
  };
  const getFolderContent = await s3Obj.getCurrentFolder(params);

  res.send(getFolderContent);
});

module.exports = router;
