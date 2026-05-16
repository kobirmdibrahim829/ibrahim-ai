const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

console.log("KEY CHECK:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result =
      await model.generateContent(userMessage);

    const response =
      result.response.text();

    res.json({
      reply: response
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "❌ Gemini AI Error"
    });
  }
});

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});