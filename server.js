const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// index.html serve করবে
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// AI API
app.post("/api/chat", (req, res) => {

  const messages = req.body.messages || [];
  const lastMsg = messages[messages.length - 1]?.content || "";

  res.json({
    reply: "🤖 তুমি বলেছো: " + lastMsg
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});