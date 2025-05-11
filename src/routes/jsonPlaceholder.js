const https = require("https");
const { URL } = require("url");

function handleJsonPlaceholder(clientReq, clientRes) {
  const fullUrl = new URL(clientReq.url, `http://${clientReq.headers.host}`);
  const path = fullUrl.pathname.replace(/^\/json/, "") + fullUrl.search;

  const options = {
    hostname: "jsonplaceholder.typicode.com",
    path,
    method: clientReq.method,
    headers: {
      ...clientReq.headers,
      host: "jsonplaceholder.typicode.com",
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on("error", (err) => {
    clientRes.writeHead(502, { "Content-Type": "text/plain" });
    clientRes.end("Bad Gateway");
    console.error("Proxy error:", err.message);
  });

  clientReq.pipe(proxyReq);
}

module.exports = { handleJsonPlaceholder };
