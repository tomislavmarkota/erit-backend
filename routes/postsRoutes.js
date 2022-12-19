const express = require("express");
const postsController = require("../controllers/postsController");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", postsController.getAllPosts);
router.post("/", postsController.createNewPost);
router.post("/image", upload.single("image"), postsController.createNewImage);

module.exports = router;
