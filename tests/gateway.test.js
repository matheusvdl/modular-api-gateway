const http = require("http");
const request = require("supertest");

let server;

beforeAll((done) => {
  server = http.createServer(require("../src/server"));
  server.listen(8000, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Gateway Tests", () => {
  it("Should forward request to jsonplaceholder correctly", async () => {
    const res = await request("http://localhost:8000").get("/json/posts/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("Should forward request to httpbin correctly", async () => {
    const res = await request("http://localhost:8000").get("/bin/get");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("url");
  });

  it("Should apply rate limiting after 100 requests (or the limit you defined)", async () => {
    const MAX = 100;
    for (let i = 0; i < MAX; i++) {
      await request("http://localhost:8000").get("/json/posts/1");
    }

    const res = await request("http://localhost:8000").get("/json/posts/1");
    expect(res.status).toBe(429);
  });

  it("Should expose metrics on /metrics", async () => {
    const res = await request("http://localhost:8000").get("/metrics");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/# HELP/);
  });

  it("Should return 404 for non-existent route", async () => {
    const res = await request("http://localhost:8000").get("/inexistente");
    expect(res.status).toBe(404);
  });
});
