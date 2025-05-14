const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });

function logRequest(data) {
  logStream.write(JSON.stringify(data) + "\n");
}

module.exports = logRequest;
