// Import the required libraries
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const express = require("express");
require('dotenv').config();

const errorMsg = "An error occurred while analyzing the sentiment"

// Add endpoint and key

const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;

// Create a new TextAnalyticsClient object using the endpoint and key
const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));


// Create a new Express app and parse incoming JSON requests
const app = express();
app.use(express.json());

// Define a route to handle POST requests to '/sentiment'
app.post("/sentiment", async (req, res) => {

  // Extract the 'sentence' parameter from the request body
  const { sentence } = req.body;

  // Return a 400 error if 'sentence' is missing
  if (!sentence) {
    return res.status(400).json({ error: "Missing 'sentence' parameter" });
  }

  // Create an array of documents to analyze, with one document containing the input 
  const documents = [
    { id: "1", language: "en", text: sentence }
  ];

  try {
    // Call the analyzeSentiment method on the TextAnalyticsClient object to analyze the sentiment of the input 'sentence'
    const result = await client.analyzeSentiment(documents);
    console.log(result);
    const resToSend = {}
    resToSend['input'] = sentence
    try{
        resToSend['sentimentResult'] = result[0].sentiment
        resToSend['sentimentScores'] = result[0].confidenceScores
    }
    catch(e){
        resToSend['sentimentResult'] = errorMsg
        resToSend['sentimentScores'] = errorMsg
    }
    
    res.send(resToSend);
  } catch (err) {
    console.log(err);
    res.send({ error: errorMsg });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
