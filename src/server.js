const http = require("http");
const { handleJsonPlaceholder } = require("./routes/jsonPlaceholder");

const PORT = 8000;

const server = http.createServer((req, res) => {
  const { url } = req;

  if (url.startsWith("/api")) {
    handleJsonPlaceholder(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
