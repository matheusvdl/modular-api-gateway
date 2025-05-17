const rateLimitMap = new Map();
const metrics = require("../metrics/metrics");

const RATE_LIMIT = 15;
const TIME_WINDOW = 50_000;

function rateLimiter(req, res, next) {
  const ip = req.socket.remoteAddress;
  const route = req.url.split("/")[1] || "/";
  const key = `${ip}|${route}`;

  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, firstRequest: now };

  if (now - entry.firstRequest < TIME_WINDOW) {
    if (entry.count >= RATE_LIMIT) {
      const retryAfter = Math.ceil(
        (TIME_WINDOW - (now - entry.firstRequest)) / 1000
      );
      res.writeHead(429, { "Content-Type": "application/json" });
      metrics.recordBlocked();
      return res.end(
        JSON.stringify({
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        })
      );
    }

    entry.count += 1;
  } else {
    entry.count = 1;
    entry.firstRequest = now;
  }

  rateLimitMap.set(key, entry);
  next();
}

module.exports = rateLimiter;
