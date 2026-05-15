const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const AI_PROVIDER = process.env.AI_PROVIDER || "github";
const GITHUB_AI_URL = process.env.GITHUB_AI_URL || "https://models.inference.ai.azure.com/chat/completions";
const GITHUB_AI_MODEL = process.env.GITHUB_AI_MODEL || "gpt-4o-mini";

app.post("/api/chat", async (req, res) => {

  try {

    const messages = req.body.messages;

    const userMessage =
      messages[messages.length - 1].content;

    let response;
    let data;
    let reply = "🤖 আমি উত্তর দিতে পারিনি";

    if (AI_PROVIDER === "github") {
      if (!process.env.GITHUB_PAT) {
        throw new Error("Missing GITHUB_PAT environment variable");
      }

      response = await fetch(GITHUB_AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GITHUB_PAT}`
        },
        body: JSON.stringify({
          model: GITHUB_AI_MODEL,
          messages: [
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("GitHub Models error", response.status, errorText);
        throw new Error("GitHub Models returned non-ok status");
      }

      data = await response.json();
      console.log(JSON.stringify(data, null, 2));

      if (data.choices?.[0]?.message?.content) {
        reply = data.choices[0].message.content;
      } else {
        console.log("Unexpected GitHub Models response shape", JSON.stringify(data, null, 2));
      }
    } else {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateMessage?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              {
                author: "user",
                content: [
                  {
                    type: "text",
                    text: userMessage
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Gemini API error", response.status, errorText);
        throw new Error("Gemini API returned non-ok status");
      }

      data = await response.json();
      console.log(JSON.stringify(data, null, 2));

      if (data.candidates?.[0]?.content?.[0]?.text) {
        reply = data.candidates[0].content[0].text;
      } else if (data.output?.[0]?.content?.[0]?.text) {
        reply = data.output[0].content[0].text;
      } else {
        console.log("Unexpected Gemini response shape", JSON.stringify(data, null, 2));
      }
    }

    res.json({ reply });

  } catch (err) {

    console.log(err);

    res.json({
      reply: "❌ Gemini Server Error"
    });
  }
});

app.listen(3000, () => {
  console.log("🚀 Gemini AI Server running on http://localhost:3000");
});