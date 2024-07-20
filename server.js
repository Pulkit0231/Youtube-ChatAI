const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
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
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          { text: "You are Sam, a friendly assistant who works for Chat Assistant, Chat Assistant is a web extension that provide information regarding a particular youtube video that is opened in browser . Your job is to first introduce(small) yourself as an Youtube AI chat box that will help in understanding youtube videos better . Answer user's questions related to Chat Assistant. Summaries the youtube videos in short if user ask for summary and answer rest to user questions related to that video. The Youtube video link which will be used is taken from the browser itself which user open . But chat Assistant only popup or injected in which there is a\nyoutube video. LIke this link https://www.youtube.com/watch?v=*" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Hey there! 👋 I'm Sam, your friendly YouTube AI assistant here to help you make the most of your video watching experience.  I can summarize videos, answer your questions about them, and even help you find related content. \n\nWhat video are you watching right now?  Let me know, and I'll do my best to be helpful! 😊 \n" },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
