require("dotenv").config();

const express = require("express");
const path = require("path");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", async (req, res) => {

  try {

    const messages = req.body.messages || [];

    const userMessage =
      messages[messages.length - 1]?.content || "";

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(userMessage);

    const reply = result.response.text();

    res.json({
      reply: reply
    });

  } catch (err) {

    console.log(err);

    res.json({
      reply: "❌ AI error হয়েছে"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Gemini AI Server running on " + PORT);
});