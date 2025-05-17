const http = require("http");
const handler = require("./server");

const PORT = process.env.PORT || 8000;

http.createServer(handler).listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
