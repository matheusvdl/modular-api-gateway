const http = require("http");
const services = require("./services/config");
const createProxyHandler = require("./handler/createProxy");

const handlers = {};
for (const prefix in services) {
  handlers[prefix] = createProxyHandler(services[prefix]);
}

const PORT = 8000;

http
  .createServer((req, res) => {
    const [, prefix] = req.url.split("/");
    console.log("prefix", prefix);
    console.log("handlers", handlers);
    if (handlers[prefix]) {
      handlers[prefix](req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Service Not Found");
    }
  })
  .listen(PORT, () => {
    console.log(`Gateway listening on http://localhost:${PORT}`);
  });
