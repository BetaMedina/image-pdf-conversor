const { unzipValidFiles } = require("../service/unzip-valid-files");
const { manipulateFiles } = require("../service/manipulate-files");


const VALID_EXTENSION = '.jpg'

const GeneratePdfByImageController = () => ({
  async handler(req, res) {
    if (!req.files) {
      return res.redirect(`/?msg="error"`);
    }
  
    const files = await unzipValidFiles({
      fileZiped: req.files[0],
      validExtension: VALID_EXTENSION,
    });

    const imagesSavedPath = await manipulateFiles.writeFiles(files);
    const outputFileName = await manipulateFiles.generatePdfsByImage(
      imagesSavedPath
    );

    return res.redirect(`/?msg="success"&file=${outputFileName}`);
  },
});

exports.GeneratePdfByImageController = GeneratePdfByImageController;
