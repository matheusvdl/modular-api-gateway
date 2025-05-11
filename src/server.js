const http = require("http");
const https = require("https");

const PORT = 8000;

const proxyApiRoute = (clientReq, clientRes) => {
  const fullUrl = new URL(clientReq.url, `http://${clientReq.headers.host}`);
  const apiPath = fullUrl.pathname.replace(/^\/api/, "") + fullUrl.search;

  const cleanHeaders = { ...clientReq.headers };
  delete cleanHeaders.host;
  delete cleanHeaders["accept-encoding"];

  const options = {
    hostname: "jsonplaceholder.typicode.com",
    path: apiPath,
    method: clientReq.method,
    headers: cleanHeaders,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on("error", (e) => {
    clientRes.writeHead(502, { "Content-Type": "text/plain" });
    clientRes.end("Bad Gateway");
    console.error("Proxy error:", e.message);
  });

  clientReq.pipe(proxyReq);
};

http
  .createServer((req, res) => {
    if (req.url.startsWith("/api")) {
      proxyApiRoute(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
