const AdmZip = require("adm-zip");

const unzipValidFiles = ({ fileZiped, validExtension }) => {
  const zip = new AdmZip(fileZiped.buffer);
  const zipEntries = zip.getEntries();

  return zipEntries.reduce((acc, zipEntry) => {
    const verifyItemType = zipEntry.entryName
      .toLocaleLowerCase()
      .trim()
      .indexOf(validExtension);
    if (verifyItemType <= 0) return acc;
    acc.push({
      originalname: zipEntry.entryName.toLocaleLowerCase().trim(),
      buffer: zipEntry.getData(),
    });
    return acc;
  }, []);
};
exports.unzipValidFiles = unzipValidFiles;
