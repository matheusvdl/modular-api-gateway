const { request } = require("https");
const { URL } = require("url");
const logRequest = require("../utils/logger");

function createProxyHandler({ target }) {
  return (clientReq, clientRes) => {
    const startTime = Date.now();
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
      proxyRes.pipe(clientRes, { end: true });

      clientRes.on("finish", () => {
        const responseTime = Date.now() - startTime;

        logRequest({
          timestamp: new Date().toISOString(),
          ip: clientReq.socket.remoteAddress,
          method: clientReq.method,
          url: clientReq.url,
          statusCode: proxyRes.statusCode,
          responseTime,
        });
      });
    });

    proxyReq.on("error", (err) => {
      clientRes.writeHead(500);
      clientRes.end("Proxy error");

      const responseTime = Date.now() - startTime;
      logRequest({
        timestamp: new Date().toISOString(),
        ip: clientReq.socket.remoteAddress,
        method: clientReq.method,
        url: clientReq.url,
        statusCode: 500,
        responseTime,
        error: err.message,
      });
    });

    clientReq.pipe(proxyReq, { end: true });
  };
}

module.exports = createProxyHandler;
