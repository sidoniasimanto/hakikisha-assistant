const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Basic route for testing the server
app.get('/', (req, res) => {
  res.send('Hakikisha Insurance Assistant Server is running!');
});

app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult?.intent?.displayName || 'Unknown';
  let responseText = 'Sorry, I didn’t understand that.';

  switch (intent) {
    case 'Welcome':
      responseText = 'Welcome to Hakikisha Insurance! How can I assist you today?';
      break;

    case 'Check Policy Status':
    case 'Policy Info':
      responseText = 'Your policy is active and valid until 31st December 2025. Would you like to receive a copy via email?';
      break;

    case 'Premium Reminder':
      responseText = 'Your next premium payment is due on 30th October. You can pay via M-Pesa or bank transfer.';
      break;

    case 'Claims Status':
      responseText = 'Please provide your claim number so I can check the status for you.';
      break;

    case 'Complaint Status':
      responseText = 'Your complaint is currently under review. We’ll update you within 48 hours.';
      break;

    case 'Escalation to Agent':
      responseText = 'I’m connecting you to a live agent. Please hold on while we transfer your chat.';
      break;

    case 'Feedback':
      responseText = 'We’d love your feedback! Please rate your experience from 1 to 5.';
      break;

    case 'Survey':
      responseText = 'Here’s a quick survey: How satisfied are you with our service today?';
      break;

    case 'Payment Reminder':
      responseText = 'You have an outstanding payment of KES 5,000 due on 30th October. Would you like to pay now?';
      break;

    case 'Claim Submission':
      responseText = 'To submit a claim, please provide your policy number and a brief description of the incident.';
      break;

    default:
      responseText = 'Sorry, I didn’t understand that. Could you please rephrase your question?';
  }

  res.json({ fulfillmentText: responseText });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});