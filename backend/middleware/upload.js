const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // you can also create a cloud storage solution later
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // rename file with timestamp
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
