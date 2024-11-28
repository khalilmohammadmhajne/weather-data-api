const app = require("../server");
const request = require("supertest");

let server;

const PORT = process.env.PORT || 8080
beforeAll((done) => {
  server = app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

module.exports = request(app);
