const multer = require("multer")
const path = require("path")
const uuid = require("uuid").v4
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "./public/images")
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `${uuid()}${ext}`)
  }
})
exports.upload = multer({ storage })
