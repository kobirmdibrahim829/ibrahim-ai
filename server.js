const express = require("express");
const app = express();

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("🚀 Ibrahim AI Server Running!");
});

// chat API (simple fallback)
app.post("/api/chat", (req, res) => {
  const messages = req.body.messages || [];

  const lastMsg = messages[messages.length - 1]?.content || "";

  res.json({
    reply: "🤖 আমি এখন live আছি! তুমি বলেছো: " + lastMsg
  });
});

// IMPORTANT: Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});