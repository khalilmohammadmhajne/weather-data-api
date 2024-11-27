module.exports = {
    apps: [
      {
        name: "start",
        script: "npm run start",
        env_file: ".env"
      },
      {
        name: "batchesCron",
        script: "npm run batchesCron",
        env_file: ".env"
      },
      {
        name: "ingest",
        script: "npm run ingest",
        env_file: ".env"
      }
    ]
  };
  