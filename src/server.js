const http = require("http");
const services = require("./services/config");
const createProxyHandler = require("./handler/createProxy");
const rateLimiter = require("./middlewares/rateLimiter");
const { getMetrics } = require("./metrics/metrics");

const handlers = {};
for (const prefix in services) {
  handlers[prefix] = createProxyHandler(services[prefix], prefix);
}

const PORT = 8000;

http
  .createServer((req, res) => {
    const [, prefix] = req.url.split("/");

    if (req.url === "/metrics") {
      const data = getMetrics();
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end(data);
    }

    if (handlers[prefix]) {
      rateLimiter(req, res, () => {
        handlers[prefix](req, res);
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Service Not Found");
    }
  })
  .listen(PORT, () => {
    console.log(`Gateway listening on http://localhost:${PORT}`);
  });
