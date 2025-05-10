const http = require("http");
const https = require("https");

const PORT = 8000;

const interceptUserRoute = (clientRes) => {
  const options = {
    hostname: "jsonplaceholder.typicode.com",
    path: "/users",
    method: "GET",
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = "";

    proxyRes.on("data", (chunk) => {
      data += chunk;
    });

    proxyRes.on("end", () => {
      clientRes.writeHead(proxyRes.statusCode, {
        "Content-Type": proxyRes.headers["content-type"] || "application/json",
      });
      clientRes.end(data);
    });
  });

  proxyReq.on("error", (e) => {
    clientRes.writeHead(502, { "Content-Type": "text/plain" });
    clientRes.end("Bad Gateway");
    console.error("Proxy error:", e.message);
  });

  proxyReq.end();
};

http
  .createServer((req, res) => {
    const { url } = req;

    switch (url) {
      case "/users":
        interceptUserRoute(res);
        break;

      case "/products":
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Products");
        break;

      case "/health":
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("OK");
        break;

      default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        break;
    }
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
