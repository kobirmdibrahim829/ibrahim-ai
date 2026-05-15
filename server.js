const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    const response = await fetch(process.env.GITHUB_AI_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GITHUB_PAT}`
      },

      body: JSON.stringify({

        model: process.env.GITHUB_AI_MODEL,

        messages: [
          {
            role: "user",
            content: userMessage
          }
        ]

      })

    });

    const data = await response.json();

    console.log(data);

    const reply =
      data.choices?.[0]?.message?.content ||
      "কোনো reply পাওয়া যায়নি";

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
  console.log("Server is running OK");
});