const express = require("express");
const AdmZip = require('adm-zip')
const {writeFile,unlink} = require('fs/promises')
const app = express();

const { exec } = require("child_process");

app.use(express.json());
app.use(express.static("public"));

const multer = require("multer");
const storage = multer.memoryStorage()

const imageFilter = function (req, file, cb) {
  if (
    file.mimetype === "application/x-zip-compressed" ||
    file.mimetype === "application/zip" 
  ) {
    return cb(null, true);
  } 
  cb(null, false);
  return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

const PORT = process.env.PORT || 3000;


const unzipFiles = ({ fileZiped, validExtension }) => {
  const zip = new AdmZip(fileZiped.buffer)
  const zipEntries = zip.getEntries()
  
  return zipEntries.reduce((acc, zipEntry) => {
    const verifyItemType = zipEntry.entryName.toLocaleLowerCase().trim().indexOf(validExtension)
    if (verifyItemType <= 0) return acc
    acc.push({ originalname: zipEntry.entryName.toLocaleLowerCase().trim(), buffer: zipEntry.getData() })
    return acc
  }, [])
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/merge", upload.array("files", 100), async (req, res) => {
  if (req.files) {
    const files = await unzipFiles({fileZiped:req.files[0], validExtension:'.jpg' })
    const outputFiles = await Promise.all(files.map(async imageConvert=>{
      const SAVED_PATH = `tmp/${imageConvert.originalname}` 
      await writeFile(SAVED_PATH,imageConvert.buffer)
      return SAVED_PATH
    }))

    const prepareFileName = outputFiles.join(" ")
    exec(`magick montage ${prepareFileName} -mode concatenate -tile 1x output/out.pdf`, async (err, stdout, stderr) => {
      if (err) throw err;
      await outputFiles.map(async fileName=> await unlink(fileName))
    });
    res.redirect('/?msg="success"')
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});
