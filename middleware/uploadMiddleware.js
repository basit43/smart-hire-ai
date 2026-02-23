const multer = require("multer");

console.log("Upload middleware file loaded");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

console.log("Exporting upload:", upload);

module.exports = upload;