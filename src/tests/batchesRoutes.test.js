const request = require('./setup');
const { getAllBatches } = require("../queries/batchesQueries.js");
const mockedBatches = require("./mock-data/mockedBatchesData.js");

jest.mock("../queries/batchesQueries", () => ({
  getAllBatches: jest.fn(),
}));

describe("GET /batches", () => {
  it("should return 200 and batches data when batches are found", async () => {
    getAllBatches.mockResolvedValue(mockedBatches);

    const response = await request.get("/batches");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedBatches);
  });

  it("should return 404 when no batches are found", async () => {
    getAllBatches.mockResolvedValue([]);

    const response = await request.get("/batches");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No batches found.");
  });

  it("should handle internal server errors", async () => {
    getAllBatches.mockRejectedValue(new Error("Database error"));

    const response = await request.get("/batches");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});
