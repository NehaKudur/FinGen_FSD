const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


const dataFilePath = "./data/responses.json";


// Root route
app.get("/", (req, res) => {
  res.send("API is running! 🚀");
});


// API endpoint
app.post("/api/get-response", (req, res) => {
  const { apiKey } = req.body;


  if (!apiKey) {
    return res.status(400).json({ error: "API key is required" });
  }


  fs.readFile(dataFilePath, "utf8", (err, jsonData) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }


    const responses = JSON.parse(jsonData);
    const userType = apiKey.toLowerCase();


    if (!responses[userType]) {
      return res.status(404).json({ error: "User type not found" });
    }


    res.json(responses[userType]);
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
