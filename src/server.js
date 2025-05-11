const http = require("http");
const { handleJsonPlaceholder } = require("./routes/jsonPlaceholder");

const PORT = 8000;

const routes = {
  json: handleJsonPlaceholder,
};

http.createServer((req, res) => {
  const [ , prefix ] = req.url.split("/");

  const routeHandler = routes[prefix];

  if (routeHandler) {
    routeHandler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Service not found");
  }
}).listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
