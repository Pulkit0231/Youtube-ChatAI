# YouTube ChatAI Assistant

This project provides a web extension and a backend server that allows users to interact with a chatbot capable of understanding and responding based on the content of a YouTube video.

## Features
1. Extracts the current YouTube video URL.
2. Sends the video URL and user queries to a backend server.
3. The backend server processes the request using a Generative AI model to generate responses based on the video URL.
4. Provides a chat interface embedded within the YouTube page.

## Prerequisites
Before you begin, ensure you have the following:
1. Node.js (version 14 or higher)
2. npm (Node Package Manager)
3. A Google Cloud API key for using the Google Generative AI model.

## Project Structure
youtube-chatai-assistant
1. contentScipt.js     # Content script for the Chrome extension
2. manifest.json       # Manifest file for the Chrome extension
3. styles.css          # Styles for the chat UI
4. loader.gif          # Loading animation for the chat UI
5. server.js           # Node.js server
6. .env                # Environment variables
7. README.md           # This file        


## Setup

1. Navigate to the "Main" directory:

    cd Youtube-ChatAI
2. Install the required npm packages:

     npm install
3. Create a .env file in the server directory with the following content:
     
   API_KEY=your_google_generative_ai_api_key

4. Start the server:
     
   node .\server.js

   The server will run on http://localhost:3000 by default.


5. Load the extension into Chrome:


   Open Chrome and go to chrome://extensions/
Enable "Developer mode" using the toggle in the top-right corner.
Click "Load unpacked" and select the extension directory.
The extension should now be installed and active. It will inject a chat interface into YouTube video pages.

## Usage
1. Open any YouTube video in your browser.
2. The chat interface will appear on the page.
3. Type your queries related to the video and submit.
4. The backend server will process your queries and the video URL, and respond with relevant information.
