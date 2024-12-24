const path = require("path");
const fsPromises = require("fs/promises");

function getLogFiles(dir) {
  const files = fsPromises.readdir(dir, { withFileTypes: true });
  console.log("files", files);
  return files;
}

function getLatestLogFile(dir) {
  const files = fsPromises.readdir(dir, { withFileTypes: true });
}

module.exports = {
  getLogFiles,
};
