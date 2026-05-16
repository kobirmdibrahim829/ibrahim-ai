const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in environment");
}

// Gemini init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// chat route
app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages || [];

    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return res.json({ reply: "❌ No message found" });
    }

    // model (SAFE & STABLE)
    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });

    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.json({
      reply: "❌ AI server error. Try again later."
    });
  }
});

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// PORT (IMPORTANT for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});