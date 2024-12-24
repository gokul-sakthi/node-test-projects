const path = require("path");
const fsPromises = require("fs/promises");

async function getLogFiles(dir) {
  return files;
}

function logNameCheck(name) {
  const isMatch = name.match(
    /log-\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z.log/
  );

  return isMatch;
}

async function createDirIfNotExists(dir) {
  try {
    await fsPromises.access(dir);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fsPromises.mkdir(dir, { recursive: true });
    }
  }
}

async function createMetadataFileIfNotExists(dir) {
  const filePath = path.join(dir, "custom-logger-metadata.txt");
  try {
    await fsPromises.access(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      const h = await fsPromises.open(filePath, "w");
      await h.write("hello\n");
      console.log("Metadata file created");
      h.close();
      return;
    }
    console.error(error, "Error creating metadata file");
  }
}

async function updateMetadataFile(dir, fileName) {
  const filePath = path.join(dir, "custom-logger-metadata.txt");
  const content = await fsPromises.readFile(filePath, "utf8");
  const lines = content.split("\n");

  const latestLogCfg = lines.findIndex((l) =>
    l.startsWith("latestLogFileName:=")
  );

  if (latestLogCfg === -1) {
    const val = `latestLogFileName:=${fileName}`;
    lines.push(val);
  } else {
    lines[latestLogCfg] = `latestLogFileName:=${fileName}`;
  }

  const h = await fsPromises.open(filePath, "w");
  await h.write(lines.join("\n"));

  h.close();
}

async function getLatestLogFile(dir) {
  const filePath = path.join(dir, "custom-logger-metadata.txt");
  const content = await fsPromises.readFile(filePath, "utf8");
  const lines = content.split("\n");

  console.log("lines", lines);

  const latestLogCfg = lines.findIndex((l) =>
    l.startsWith("latestLogFileName:=")
  );

  if (latestLogCfg === -1) {
    return null;
  }

  console.log("index found", latestLogCfg, lines[latestLogCfg]);
  const latestLogFileName = lines[latestLogCfg].split(":=")[1];
  console.log("latestLogFileName", latestLogFileName, lines[latestLogCfg]);
  return latestLogFileName;
}

async function writeLog(content, dir) {
  const getLatestLogFileName = await getLatestLogFile(dir);

  if (!getLatestLogFileName) {
    console.log("no latest log file in config found!");
    return;
  }

  console.log("latestLogFileName", getLatestLogFileName);

  const pathName = path.join(dir, getLatestLogFileName);
  const stat = await fsPromises.stat(pathName);

  if (stat.size > 1024 * 1024 * 1) {
    console.log("file size is more than 10 MB, creating new file");
    const fileName = `log-${new Date().toISOString()}.log`;
    const h = await fsPromises.open(path.join(dir, fileName), "w");
    console.log("Log file created", fileName);
    await updateMetadataFile(dir, fileName);
    await h.write(content.concat("\n"));
    h.close();
    return;
  } else {
    await fsPromises.appendFile(pathName, content.concat("\n"));
  }
}

async function initLogSetup(dir) {
  await createDirIfNotExists(dir);
  const files = await fsPromises.readdir(dir, { withFileTypes: true });

  await createMetadataFileIfNotExists(dir);

  const onlyFiles = files
    .filter((f) => f.isFile())
    .filter((f) => logNameCheck(f.name));

  console.log(onlyFiles.map((f) => f.name));
  const metadataFile = files.find(
    (f) => f.name === "custom-logger-metadata.txt"
  );

  if (!metadataFile) {
    await createMetadataFileIfNotExists(dir);
  }

  if (onlyFiles.length === 0) {
    const fileName = `log-${new Date().toISOString()}.log`;
    await fsPromises.open(path.join(dir, fileName), "w");
    console.log("Log file created", fileName);
    await updateMetadataFile(dir, fileName);
  }

  // console.log("files setup", files);
}

module.exports = {
  getLogFiles,
  createDirIfNotExists,
  getLatestLogFile,
  initLogSetup,
  writeLog,
};
