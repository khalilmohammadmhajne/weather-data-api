const express = require("express");
const router = express.Router();
const { getAllBatches } = require("../queries/batchesQueries");
const { NotFoundError } = require("../utils/errors");

router.get("/", async (_ , res, next) => {
  try {
    const batches = await getAllBatches();
    if (!batches || batches.length === 0) {
      return next(new NotFoundError("No batches found."));
    }
    res.status(200).json(batches);
    
  } catch (error) {
    console.error("Error fetching batches");
    next(error);
  }
});

module.exports = router;
