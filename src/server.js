const http = require("http");
const https = require("https");

const PORT = 8000;

const proxyApiRoute = (clientReq, clientRes) => {
  const fullUrl = new URL(clientReq.url, `http://${clientReq.headers.host}`);
  const apiPath = fullUrl.pathname.replace(/^\/api/, "") + fullUrl.search;

  // if needed to send headers, use this code
  // const cleanHeaders = { ...clientReq.headers };
  // delete cleanHeaders.host;
  // delete cleanHeaders["accept-encoding"];
  const options = {
    hostname: "jsonplaceholder.typicode.com",
    path: apiPath,
    method: clientReq.method,
    // headers: cleanHeaders,
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

    if (url.startsWith("/api")) {
      proxyApiRoute(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
