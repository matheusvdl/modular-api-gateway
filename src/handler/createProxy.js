const { request } = require("https");
const { URL } = require("url");

function createProxyHandler({ target }) {
  return (clientReq, clientRes) => {
    const originalUrl = new URL(
      clientReq.url,
      `http://${clientReq.headers.host}`
    );
    const apiPath = originalUrl.pathname.split("/").slice(2).join("/");
    const finalUrl = new URL(apiPath + originalUrl.search, target);

    const options = {
      method: clientReq.method,
      headers: {
        ...clientReq.headers,
        host: finalUrl.host,
      },
    };

    const proxyReq = request(finalUrl, options, (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy error:", err.message);
      clientRes.writeHead(502, { "Content-Type": "text/plain" });
      clientRes.end("Bad Gateway");
    });

    clientReq.pipe(proxyReq);
  };
}

module.exports = createProxyHandler;
