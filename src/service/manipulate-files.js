const { writeFile, unlink } = require("fs/promises");
const { exec } = require("child_process");

const manipulateFiles = () => ({
  writeFiles(files) {
    return Promise.all(
      files.map(async (imageConvert) => {
        const SAVED_PATH = `tmp/${imageConvert.originalname}`;
        await writeFile(SAVED_PATH, imageConvert.buffer);
        return SAVED_PATH;
      })
    );
  },

  removeFiles(files) {
    return files.map(async (fileName) => await unlink(fileName));
  },

  async generatePdfsByImage(allFilesNames) {
    const prepareFileName = allFilesNames.join(" ");
    const outputFileName = `output/${Date.now()}.pdf`;

    await exec(
      `magick montage ${prepareFileName} -mode concatenate -tile 1x ${outputFileName}`,
      async (err, stdout, stderr) => {
        if (err) throw err;
        await this.removeFiles(allFilesNames);
      }
    );
    return outputFileName;
  },
});
exports.manipulateFiles = manipulateFiles();
