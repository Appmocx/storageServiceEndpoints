var express = require("express");
var s3 = require("storageservice").S3Storage;
var f = require("storageservice");
var router = express.Router();

const bucketOptions = {
  bucketName: "appmocxfiles",
  accessKeyId: "AKIAZUMMZEDGCCTLVBRT",
  secretAccessKey: "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",
};

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
  const opt = {
    acl: "public-read",
  };
  const upload = await s3Obj.uploadFileObject(file, opt);
  res.send(upload);
});

router.get("/getAllFile", async function (req, res, next) {
  const getAllObj = await s3Obj.getAllFile();
  let getAllObjName = await getAllObj["Contents"].map((obj) => {
    let rObj = {};
    rObj["Name"] = obj["Key"];
    return rObj;
  });
  res.send(getAllObjName);
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

module.exports = router;
