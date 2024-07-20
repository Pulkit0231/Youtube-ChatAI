const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const cors = require('cors');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput, videoUrl) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          { text: "You are Sam, a friendly assistant who works for Chat Assistant, Chat Assistant is a web extension that provide information regarding a particular youtube video that is opened in browser. Your job is to first introduce (small) yourself as an YouTube AI chat box that will help in understanding YouTube videos better. Answer user's questions related to Chat Assistant. Summarize the YouTube videos in short if user asks for summary and answer rest of user's questions related to that video. You have access to the video at the URL ${videoUrl}. The YouTube video link which will be used is taken from the browser itself which user opened. But chat Assistant only pops up or injects in which there is a YouTube video. Like this link https://www.youtube.com/watch?v=*" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "👋 I'm Sam, your friendly YouTube AI assistant from Chat Assistant. I'm here to help you understand your favorite videos better.  I'm integrated directly into your browser, so just open a YouTube video and I'll pop up ready to assist.  \n\nWhat can I help you with today?  Ask me anything about the video you're watching, like \"What's the main point of this video?\" or \"Can you summarize this section?\"  I'm happy to answer questions or even provide a short summary of the video. Just let me know! \n" },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    const videoUrl = req.body?.videoUrl;
    console.log('incoming /chat req', userInput, videoUrl)
    if (!userInput || !videoUrl) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput, videoUrl);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
