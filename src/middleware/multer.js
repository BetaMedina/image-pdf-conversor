const multer = require("multer");


const configMulterStorage = () =>{
  const storageType = multer.memoryStorage()
  return multer({ storage: storageType });
}

exports.multerConfig = configMulterStorage