const assert = require("assert");
const { Buffer } = require("buffer");

const buf = Buffer.alloc(3);

buf[0] = 0x3;
buf[1] = -2;
buf[2] = 44.9;

// console.log(buf);
// console.log(buf[0], buf[1], buf[2]);

function allocByteFromString(arg) {
  assert(typeof arg === "string", "argument must be a string");

  let splitBuff = arg.split(" ");
  let newSplit = [];

  for (let i = 0; i < splitBuff.length; i += 2) {
    const curr = i;
    const next = Math.min(splitBuff.length - 1, i + 1);

    if (curr === next) {
      newSplit.push(splitBuff[curr]);
    } else {
      const newByte = splitBuff[curr].concat(splitBuff[next]);
      newSplit.push(newByte);
    }
  }

  const buff = Buffer.alloc(newSplit.length);
  console.log("Buffer length:", buff.length);

  for (let i = 0; i < newSplit.length; i++) {
    let byteString = newSplit[i];
    byteString = parseInt(byteString, 2).toString(16).toUpperCase();
    byteString = "0x" + byteString;

    buff[i] = byteString;
  }

  for (let i = 0; i < buff.length; i++) {
    console.log(buff.readUInt8(i));
  }

  console.log(buff.toString("utf-8"));
}

allocByteFromString("0100 1000 0110 1001 0010 0001");
console.log(Buffer.poolSize);
