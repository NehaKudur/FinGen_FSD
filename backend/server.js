const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


const dataFilePath = "./data/responses.json";


// Root route
app.get("/", (req, res) => {
  res.send("API is running! 🚀");
});


// Original API endpoint
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

// New AI Endpoint for Game Analysis
app.post("/api/analyze-game", async (req, res) => {
  const summary = req.body.summary || req.body.gameData;
  const { gameId } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "YOUR_GROQ_API_KEY_HERE") {
    return res.status(500).json({ error: "Missing GROQ_API_KEY in backend .env file" });
  }

  // Build game-specific prompt
  let systemPrompt = "You are a financial advisor analyzing a player's performance in a finance game.";
  let userPrompt;

  if (gameId === 'game1') {
    // Grocery Grab - purchase decisions
    userPrompt = `Here is the player's game summary for Grocery Grab (budget management game):
${JSON.stringify(summary, null, 2)}

Analyze their choices and return strictly a JSON object in this format (no markdown formatting, no comments, just valid JSON):
{
  "insights": [
    { "text": "Specific feedback on a choice", "type": "good" },
    { "text": "Specific caution or improvement point", "type": "warning" },
    { "text": "A poor decision they made", "type": "bad" }
  ],
  "lesson": { 
    "title": "A catchy lesson title", 
    "content": "A short paragraph explaining the main takeaway from their choices." 
  },
  "summary": "A 1-sentence overall conclusion."
}`;
  } else if (gameId === 'game2') {
    // Haunted Escape Room - taxes, insurance, decision-making
    userPrompt = `Here is the player's game summary for Haunted Escape Room (taxes and insurance game):
${JSON.stringify(summary, null, 2)}

Use second person language: address the player as "you" and refer to their choices as "your choice". Describe where you were right or wrong, explain the financial concepts involved, and provide a direct, detailed report.

Analyze their choices and return strictly a JSON object in this format (no markdown formatting, no comments, just valid JSON):
{
  "insights": [
    { "text": "Specific feedback on a choice", "type": "good" },
    { "text": "Specific caution or improvement point", "type": "warning" },
    { "text": "A poor decision they made", "type": "bad" }
  ],
  "lesson": { 
    "title": "A catchy lesson title", 
    "content": "A short paragraph explaining the main takeaway from their choices." 
  },
  "summary": "A 1-sentence overall conclusion."
}`;
  } else if (gameId === 'game3') {
    // Recession Run - recession simulation, budget, investments, emergency fund
    userPrompt = `Here is the player's game summary for Recession Run:
${JSON.stringify(summary, null, 2)}

Use second person language: address the player as "you" and refer to their choices as "your choice". Give a detailed report on where you were right or wrong, call out the financial concepts you dealt with (budgeting, emergency funds, insurance, investment, debt), and explain what each choice meant.

Analyze their choices and return strictly a JSON object in this format (no markdown formatting, no comments, just valid JSON):
{
  "insights": [
    { "text": "Specific feedback on a choice", "type": "good" },
    { "text": "Specific caution or improvement point", "type": "warning" },
    { "text": "A poor decision you made", "type": "bad" }
  ],
  "lesson": { 
    "title": "A catchy lesson title", 
    "content": "A short paragraph explaining the main takeaway from your choices." 
  },
  "summary": "A 1-sentence overall conclusion."
}`;
  } else if (gameId === 'game4') {
    // Financial Mahjong - matching financial concepts
    userPrompt = `Here is the player's game summary for Financial Mahjong:
${JSON.stringify(summary, null, 2)}

Use second person language: address the player as "you" and refer to their choices as "your choice". Give a detailed report on where you were right or wrong, explain the financial concepts involved (savings, debt, investment, insurance, interest, budget, inflation), and describe how the matching decisions reflect those concepts.

Analyze their choices and return strictly a JSON object in this format (no markdown formatting, no comments, just valid JSON):
{
  "insights": [
    { "text": "Specific feedback on a choice", "type": "good" },
    { "text": "Specific caution or improvement point", "type": "warning" },
    { "text": "A poor decision you made", "type": "bad" }
  ],
  "lesson": { 
    "title": "A catchy lesson title", 
    "content": "A short paragraph explaining the main takeaway from your choices." 
  },
  "summary": "A 1-sentence overall conclusion."
}`;
  } else if (gameId === 'game5') {
    // Credit score snake game
    userPrompt = `Here is the player's game summary for Credit Score Snake & Ladder:
${JSON.stringify(summary, null, 2)}

Use second person language: address the player as "you" and refer to their choices as "your choice". Give a detailed report on where you were right or wrong, explain the credit and financial concepts involved (credit score, on-time payments, utilization, debt, risk), and make it personal.

Analyze their choices and return strictly a JSON object in this format (no markdown formatting, no comments, just valid JSON):
{
  "insights": [
    { "text": "Specific feedback on a choice", "type": "good" },
    { "text": "Specific caution or improvement point", "type": "warning" },
    { "text": "A poor decision you made", "type": "bad" }
  ],
  "lesson": { 
    "title": "A catchy lesson title", 
    "content": "A short paragraph explaining the main takeaway from your choices." 
  },
  "summary": "A 1-sentence overall conclusion."
}`;
  } else if (gameId === 'game6') {
    // Portfolio Panic - market mood, action cards, diversification
    userPrompt = `Here is the player's game summary for Portfolio Panic:
${JSON.stringify(summary, null, 2)}

Use second person language: address the player as "you" and refer to their choices as "your choice". Give a detailed report on where you were right or wrong, explain the financial concepts involved (portfolio diversification, risk, market timing, liquidity, asset allocation), and make it clear how these choices matter in real finance.

Analyze their choices and return strictly a JSON object in this format (no markdown formatting, no comments, just valid JSON):
{
  "insights": [
    { "text": "Specific feedback on a choice", "type": "good" },
    { "text": "Specific caution or improvement point", "type": "warning" },
    { "text": "A poor decision you made", "type": "bad" }
  ],
  "lesson": { 
    "title": "A catchy lesson title", 
    "content": "A short paragraph explaining the main takeaway from your choices." 
  },
  "summary": "A 1-sentence overall conclusion."
}`;
  } else if (gameId === 'quiz') {
    // Default for other games
    userPrompt = `Here is the player's game summary:
${JSON.stringify(summary, null, 2)}

Analyze their choices and return strictly a JSON object in this format (no markdown formatting, no comments, just valid JSON):
{
  "insights": [
    { "text": "Specific feedback on a choice", "type": "good" },
    { "text": "Specific caution or improvement point", "type": "warning" },
    { "text": "A poor decision they made", "type": "bad" }
  ],
  "lesson": { 
    "title": "A catchy lesson title", 
    "content": "A short paragraph explaining the main takeaway from their choices." 
  },
  "summary": "A 1-sentence overall conclusion."
}`;
  }

  try {
    console.log(`Sending summary to Groq model llama-3.3-70b-versatile for game ${gameId}`);
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error("Groq API Error:", response.status, responseText);
      return res.status(response.status).json({ error: `AI backend error: ${responseText}` });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Groq response as JSON:", responseText, parseError);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    if (!Array.isArray(data.choices) || !data.choices[0]?.message) {
      console.error("Groq response missing choice message:", data);
      return res.status(500).json({ error: "AI did not return valid choices" });
    }

    const messageContent = data.choices[0].message.content;
    let aiJson;
    try {
      aiJson = typeof messageContent === 'object' ? messageContent : JSON.parse(messageContent);
    } catch (parseError) {
      console.error("Failed to parse AI message content as JSON:", messageContent, parseError);
      return res.status(500).json({ error: "AI response JSON parse error" });
    }

    res.json(aiJson);

  } catch (error) {
    console.error("Backend Error bridging to Groq:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
