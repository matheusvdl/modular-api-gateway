const https = require("https");

function handleJsonPlaceholder(clientReq, clientRes) {
  const fullUrl = new URL(clientReq.url, `http://${clientReq.headers.host}`);
  const apiPath = fullUrl.pathname.replace(/^\/api/, "") + fullUrl.search;

  const options = {
    hostname: "jsonplaceholder.typicode.com",
    path: apiPath,
    method: clientReq.method,
    headers: {
      ...clientReq.headers,
      host: "jsonplaceholder.typicode.com",
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    clientRes.writeHead(502);
    clientRes.end("Bad Gateway");
  });

  clientReq.pipe(proxyReq, { end: true });
}

module.exports = { handleJsonPlaceholder };
