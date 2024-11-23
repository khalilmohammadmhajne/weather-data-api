const cron = require("node-cron");
const { ingestWeatherData } = require("./ingestData");

// Every Minute
cron.schedule("* * * * *", () => {
  console.log("Running ingestion job...");
  ingestWeatherData();
});
