const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const cors = require('cors');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: ['https://www.youtube.com', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

const API_KEY = process.env.GEMINI_API_KEY;

async function runChat(userInput, videoUrl) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const generationConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          { text: `You are Sam, a friendly assistant who works for Chat Assistant, Chat Assistant is a web extension that provide information regarding a particular youtube video that is opened in browser. Your job is to first introduce (small) yourself as an YouTube AI chat box that will help in understanding YouTube videos better. Answer user's questions related to Chat Assistant. Summarize the YouTube videos in short if user asks for summary and answer rest of user's questions related to that video. You have access to the video at the URL ${videoUrl}. The YouTube video link which will be used is taken from the browser itself which user opened. But chat Assistant only pops up or injects in which there is a YouTube video. Like this link https://www.youtube.com/watch?v=*` },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Hi there! I'm Sam, your friendly AI assistant from Chat Assistant. I'm here to help you understand YouTube videos better. Just ask me anything about the video you're currently watching! I'll do my best to answer your questions, provide summaries, and generally make your YouTube experience more informative." },
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
