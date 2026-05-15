const express = require("express");
const app = express();

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running OK");
});

// chat API
app.post("/api/chat", (req, res) => {
  try {
    const messages = req.body.messages || [];
    const lastMsg = messages.length > 0 ? messages[messages.length - 1].content : "";

    return res.json({
      reply: "🤖 Reply: " + lastMsg
    });

  } catch (err) {
    return res.json({
      reply: "🤖 Server error fixed version working"
    });
  }
});

// IMPORTANT PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});