const metrics = {
  totalRequests: {},
  totalBlocked: 0,
  totalResponseTime: {},
  countResponses: {},
};

function recordRequest(route) {
  metrics.totalRequests[route] = (metrics.totalRequests[route] || 0) + 1;
}

function recordBlocked() {
  metrics.totalBlocked += 1;
}

function recordResponseTime(route, time) {
  metrics.totalResponseTime[route] = (metrics.totalResponseTime[route] || 0) + time;
  metrics.countResponses[route] = (metrics.countResponses[route] || 0) + 1;
}

function getMetrics() {
  let output = "";

  for (const route in metrics.totalRequests) {
    output += `gateway_requests_total{route="${route}"} ${metrics.totalRequests[route]}\n`;
  }

  for (const route in metrics.totalResponseTime) {
    const totalTime = metrics.totalResponseTime[route];
    const count = metrics.countResponses[route];
    const average = (totalTime / count).toFixed(2);
    output += `gateway_avg_response_time_ms{route="${route}"} ${average}\n`;
  }

  output += `gateway_blocked_requests_total ${metrics.totalBlocked}\n`;

  return output;
}

module.exports = {
  recordRequest,
  recordBlocked,
  recordResponseTime,
  getMetrics,
};
