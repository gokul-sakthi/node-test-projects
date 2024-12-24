const path = require("path");
const { initLogSetup, writeLog } = require("./src/fileHelpers");

// console.log("dirname", __filename, __dirname);
const basePath = path.join(path.resolve(), "logs");

async function init() {
  await initLogSetup(basePath);
  console.log("init");
  await writeLog("hello world", basePath);

  for (let i = 0; i < 10_00_000; i++) {
    await writeLog(`hello world ${i}`, basePath);
  }
}

init();
