// const cron = require("node-cron");
const { ingestWeatherData } = require("./ingestData");

ingestWeatherData();
// Every Minute
// cron.schedule("* * * * *", () => {
//   console.log("Running ingestion job...");
//   ingestWeatherData();
// });
