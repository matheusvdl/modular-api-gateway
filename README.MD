# About

This api gateway is reponsible to supports dynamic routing, request proxying, IP-based rate limiting, Prometheus style metrics and structured logging 

---

## Features

- **Reverse proxy** to multiple external services
- **Dynamic routing** based on URL prefix
- **Prometheus-compatible metrics** exposed at `/metrics`
- **Modular architecture** (handlers, middlewares, services)
- **Rate limiting per IP**, configurable threshold
- **Structured logging** to `.log` file


## Skills 

- Reverse proxy with http.request
- Stream handling using req.pipe()
- In-memory concurrency control (using Map)
- Clean code separation by responsibility
- Logging and observability without external libs



