const fsPromises = require("fs/promises");
const path = require("path");
const { getLogFiles } = require("./helpers");

console.log("dirname", __filename, __dirname);

getLogFiles();
