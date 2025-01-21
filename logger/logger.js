const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'app.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function getTimeStamp() {
  return new Date().toISOString();
}

console.log = function (message) {
  logStream.write(`[${getTimeStamp()}] LOG: ${message}\n`);
  process.stdout.write(`[${getTimeStamp()}] LOG: ${message}\n`);
};

console.error = function (message) {
  logStream.write(`[${getTimeStamp()}] ERROR: ${message}\n`);
  process.stderr.write(`[${getTimeStamp()}] ERROR: ${message}\n`);
};