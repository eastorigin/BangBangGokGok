const multer = require("multer");
const path = require("path");
// multer
const uploadDetail = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },

        filename: function (req, file, done) {
            const extension = path.extname(file.originalname);
            done(null, path.basename(file.originalname, extension) + Date.now() + extension);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadDetail;
