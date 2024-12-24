const fsPromises = require("node:fs/promises");

async function writeNaiveFileApproach(filepath) {
  const fileHandle = await fsPromises.open(filepath, "w");

  const writeStream = fileHandle.createWriteStream();

  console.log(writeStream.writableHighWaterMark);
  console.log(writeStream.writableLength);

  writeStream.write("Hello World");

  for (let i = 0; i < 100_00_000; i++) {
    writeStream.write(`\n${i}`);
  }

  writeStream.end(() => {
    console.log("File written");
  });
}

async function writeStreamApproachEfficient1(filepath) {
  const fileHandle = await fsPromises.open(filepath, "w");
  const writeStream = fileHandle.createWriteStream();

  let counter = 0;

  console.log(writeStream.writableHighWaterMark);
  console.log(writeStream.writableLength);

  function writeMany() {
    while (counter < 1_00_00_000) {
      const buff = Buffer.from(`\n${counter}`);
      const isOk = writeStream.write(buff);
      if (!isOk) {
        break;
      }
      counter++;
    }
  }

  writeStream.on("drain", () => {
    writeMany();
  });

  writeStream.on("finish", () => {
    console.log("File written");
    writeStream.end();
    fileHandle.close();
  });

  writeMany();
}

// writeNaiveFileApproach("streams-test.txt");

writeStreamApproachEfficient1("streams-test-eff1.txt");
