app.post("/api/chat", (req, res) => {

  const messages = req.body.messages || [];
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";

  let reply = "";

  if(lastMsg.includes("hi") || lastMsg.includes("hello") || lastMsg.includes("হাই")){
    reply = "👋 হ্যালো! আমি Ibrahim AI";
  }

  else if(lastMsg.includes("কেমন আছো")){
    reply = "😄 আমি ভালো আছি! তুমি কেমন আছো?";
  }

  else if(lastMsg.includes("তোমার নাম")){
    reply = "🤖 আমার নাম Ibrahim AI";
  }

  else if(lastMsg.includes("কি করতে পারো")){
    reply = "🚀 আমি বাংলা ও ইংরেজিতে কথা বলতে পারি, chat করতে পারি, voice support আছে!";
  }

  else{
    reply = "🤖 আমি এখনো শিখছি, আরেকটু সহজভাবে বলো 😄";
  }

  res.json({
    reply: reply
  });

});