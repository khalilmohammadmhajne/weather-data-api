const request = require('./setup');
const { getWeatherData, getSummarizedWeatherData } = require("../queries/weatherDataQueries");
const mockedWeatherData = require("./mock-data/mockedWeatherData");

jest.mock("../queries/weatherDataQueries", () => ({
  getWeatherData: jest.fn(),
  getSummarizedWeatherData: jest.fn(),
}));

describe("GET /weather", () => {
  it("should return 200 and weather data when lat and lon are provided", async () => {
    getWeatherData.mockResolvedValue(mockedWeatherData.weatherData);

    const response = await request
      .get("/weather/data")
      .query({ lat: 40, lon: -74 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedWeatherData.weatherData);
  });

  it("should return 400 when lat or lon are missing", async () => {
    const response = await request.get("/weather/data");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Latitude and Longitude are required.");
  });

  it("should return 404 when no weather data is found for the given lat and lon", async () => {
    getWeatherData.mockResolvedValue([]);

    const response = await request
      .get("/weather/data")
      .query({ lat: 40, lon: -74 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No weather data found for the specified location.");
  });

  it("should return 200 and summarized weather data when lat and lon are provided", async () => {
    getSummarizedWeatherData.mockResolvedValue(mockedWeatherData.summarizedWeatherData);

    const response = await request
      .get("/weather/summarize")
      .query({ lat: 40, lon: -74 });
    console.log(response.body)
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedWeatherData.returnedSummarizedWeatherData);
  });

  it("should return 400 when lat or lon are missing for summarize route", async () => {
    const response = await request.get("/weather/summarize");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Latitude and Longitude are required.");
  });

  it("should return 404 when no summarized weather data is found", async () => {
    getSummarizedWeatherData.mockResolvedValue([]);

    const response = await request
      .get("/weather/summarize")
      .query({ lat: 40, lon: -74 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No weather data found for the specified location.");
  });

  it("should handle internal server errors", async () => {
    getWeatherData.mockRejectedValue(new Error("Database error"));

    const response = await request
      .get("/weather/data")
      .query({ lat: 40, lon: -74 });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});
