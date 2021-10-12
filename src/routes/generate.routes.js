const {multerConfig} = require('../middleware/multer')
const { GeneratePdfByImageController } = require("../controller/generate-pdf-by-image");

module.exports = (app) =>{
  app.post("/merge", multerConfig().array("files", 100),GeneratePdfByImageController().handler);
}