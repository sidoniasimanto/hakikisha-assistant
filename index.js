const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');

const app = express();
app.use(bodyParser.json());

// Cosmos DB setup
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});
const container = cosmosClient
  .database(process.env.COSMOS_DATABASE)
  .container(process.env.COSMOS_CONTAINER);

// Function to log user messages
async function logUserMessage(userId, message) {
  try {
    await container.items.create({
      userId,
      message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error writing to Cosmos DB:', error.message);
  }
}

app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult?.intent?.displayName || 'Unknown';
  const userQuery = req.body.queryResult?.queryText || '';
  const userId = req.body.session || 'anonymous';

  let responseText = 'Sorry, I didn’t understand that.';

  switch (intent) {
    case 'Welcome':
      responseText = 'Welcome to Hakikisha Insurance! How can I assist you today?';
      break;
    case 'Check Policy Status':
      responseText = 'Your policy is active and valid until 31st December 2025.';
      break;
    case 'Premium Reminder':
      responseText = 'Your next premium payment is due on 30th October.';
      break;
    case 'Claims Status':
      responseText = 'Please provide your claim number so I can check the status.';
      break;
    case 'Complaint Status':
      responseText = 'Your complaint is currently under review. We’ll update you within 48 hours.';
      break;
    case 'Escalation to Agent':
      responseText = 'I’m connecting you to a live agent. Please hold on.';
      break;
    case 'Feedback':
      responseText = 'We’d love your feedback! Please rate your experience from 1 to 5.';
      break;
    default:
      responseText = 'Sorry, I didn’t understand that. Could you please rephrase your question?';
  }

  // Log the interaction to Cosmos DB
  await logUserMessage(userId, {
    intent,
    userQuery,
    responseText
  });

  res.json({ fulfillmentText: responseText });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});