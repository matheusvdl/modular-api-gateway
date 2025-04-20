const http = require("http");

const PORT = 8000;

const options = {
  hostname: "https://jsonplaceholder.typicode.com/users",
  path: "",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const interceptUsers = () => {
  http.request(options, (res) => console.log("RESSS>>>", res.on('data')));
};

http
  .createServer((req, res) => {
    const { url } = req;

    switch (url) {
      case "/users":
        res.writeHead(200, { "Content-Type": "text/plain" });
        interceptUsers();
        break;

      case "/products":
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Products");
        break;

      case "/health":
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("OK");
        break;

      default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        break;
    }
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
