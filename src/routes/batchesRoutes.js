const express = require("express");
const router = express.Router();
const { getAllBatches } = require("../queries/batchesQueries");

router.get("/", async (req, res) => {
  try {
    const batches = await getAllBatches();
    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: "No batches found." });
    }
    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
