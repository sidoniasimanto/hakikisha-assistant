require('dotenv').config();

const express = require('express');
const { CosmosClient } = require('@azure/cosmos');
const app = express();
app.use(express.json());

// Cosmos DB Config
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;

if (!endpoint || !key || !databaseId || !containerId) {
  console.error('❌ Missing Cosmos DB credentials or config. Check your .env file.');
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

async function getChatContainer() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  const { container } = await database.containers.createIfNotExists({ id: containerId });
  return container;
}

// --- INTENTS (10+ with 20 utterances each, realistic) ---
const intents = [
  {
    id: "Policy_Info",
    intentName: "Policy_Info",
    displayName: "Policy Information",
    trainingPhrases: [
      "Check my policy PN123456",
      "What's the status of policy PN123456?",
      "Show me details for policy PN123456",
      "Is my policy PN123456 active?",
      "Tell me about my policy PN123456",
      "Can I see my policy information?",
      "What is the expiry date for policy PN123456?",
      "How much is my premium for PN123456?",
      "Is policy PN123456 still valid?",
      "When does my policy PN123456 expire?",
      "Give me the product type for PN123456",
      "What is the status of my insurance policy?",
      "Can you check my policy details?",
      "Show policy PN123456 summary",
      "Is my insurance policy up to date?",
      "When was my policy PN123456 created?",
      "What is the product on my policy?",
      "Is my policy lapsed or active?",
      "What is the premium for my policy?",
      "Can I get my policy information emailed?"
    ],
    parameters: ["PolicyNumber"],
    responses: [
      "Your policy PN123456 is active.",
      "Policy PN123456 is currently lapsed.",
      "Policy PN123456 is valid until 2028-02-02.",
      "Your premium for PN123456 is KES 352.58.",
      "The product for PN123456 is Comprehensive Auto.",
      "Policy PN123456 was created on 2022-04-16.",
      "Your policy is up to date.",
      "Policy PN123456 is not active.",
      "Policy PN123456 is cancelled.",
      "Policy PN123456 is valid.",
      "Policy PN123456 is lapsed.",
      "Policy PN123456 is pending renewal.",
      "Policy PN123456 is set to expire soon.",
      "Policy PN123456 is in good standing.",
      "Policy PN123456 is overdue for payment.",
      "Policy PN123456 is suspended.",
      "Policy PN123456 is under review.",
      "Policy PN123456 is being processed.",
      "Policy PN123456 is awaiting documents.",
      "Policy PN123456 information has been emailed to you."
    ]
  },
  {
    id: "Payment_Reminder",
    intentName: "Payment_Reminder",
    displayName: "Payment Reminder",
    trainingPhrases: [
      "When is my payment due?",
      "Remind me about premium",
      "When do I need to pay my insurance?",
      "Is my payment overdue?",
      "Send me a payment reminder",
      "What is my next payment date?",
      "How much do I owe for my policy?",
      "Can you remind me to pay?",
      "Is my premium payment pending?",
      "When is my next premium due?",
      "Do I have any overdue payments?",
      "What is the payment status for my policy?",
      "Can I pay my premium online?",
      "How do I pay my insurance?",
      "Is my payment successful?",
      "Can I get a payment receipt?",
      "What is my outstanding balance?",
      "Remind me to pay my insurance next month",
      "Can you notify me before payment is due?",
      "How do I set up automatic payments?"
    ],
    parameters: ["PolicyNumber", "dueDate"],
    responses: [
      "Your next payment is due on 2024-08-24.",
      "Your premium payment is pending.",
      "You have no overdue payments.",
      "A payment reminder has been set.",
      "Your outstanding balance is KES 352.58.",
      "You can pay your premium online.",
      "Your payment was successful.",
      "A receipt has been sent to your email.",
      "Your payment is overdue.",
      "You have set up automatic payments.",
      "Your payment status is pending.",
      "You will be notified before your payment is due.",
      "Your next premium is due soon.",
      "You have no outstanding balance.",
      "Your payment is being processed.",
      "Your payment reminder is active.",
      "You can pay via mobile money.",
      "Your payment is scheduled for next month.",
      "Your payment history is available.",
      "Your payment reminder has been updated."
    ]
  },
  {
    id: "SubmitComplaint",
    intentName: "SubmitComplaint",
    displayName: "Submit Complaint",
    trainingPhrases: [
      "I want to submit a complaint",
      "Report an issue with my policy",
      "I have a problem with my insurance",
      "How do I file a complaint?",
      "Can I complain about my premium?",
      "My claim was rejected unfairly",
      "I want to escalate an issue",
      "How do I contact customer service?",
      "I am not satisfied with the service",
      "My payment was not processed",
      "I want to dispute a charge",
      "My policy terms are unclear",
      "I want to report poor customer service",
      "I have a billing issue",
      "My complaint is not resolved",
      "I want to follow up on my complaint",
      "How do I check complaint status?",
      "Can I get a complaint reference number?",
      "I want to withdraw my complaint",
      "How do I update my complaint?"
    ],
    parameters: ["PolicyNumber", "complaintDescription"],
    responses: [
      "Your complaint has been submitted.",
      "A customer service agent will contact you soon.",
      "Your complaint reference number is COMP0001.",
      "Your issue is being investigated.",
      "Your complaint is in progress.",
      "Your complaint has been resolved.",
      "Your complaint is pending review.",
      "You can check complaint status online.",
      "Your complaint has been escalated.",
      "Your complaint has been withdrawn.",
      "Your complaint is awaiting documents.",
      "Your complaint is being processed.",
      "Your complaint is under review.",
      "Your complaint is closed.",
      "Your complaint is open.",
      "Your complaint has been updated.",
      "Your complaint is assigned to an agent.",
      "Your complaint is pending feedback.",
      "Your complaint is being followed up.",
      "Your complaint status is available."
    ]
  },
  {
    id: "Check_Claim_Status",
    intentName: "Check_Claim_Status",
    displayName: "Check Claim Status",
    trainingPhrases: [
      "What is the status of claim CLM001?",
      "Check my claim status",
      "Is my claim approved?",
      "Has my claim been processed?",
      "Can I get claim details?",
      "Is my claim pending?",
      "Was my claim rejected?",
      "Show me my claim history",
      "How much was paid for my claim?",
      "When was my claim submitted?",
      "Can I get claim reference number?",
      "Is my claim under review?",
      "Can I appeal my claim decision?",
      "How do I track my claim?",
      "Is my claim closed?",
      "Can I get claim status update?",
      "Was my claim paid?",
      "Is my claim awaiting documents?",
      "Can I get claim feedback?",
      "Is my claim being followed up?"
    ],
    parameters: ["ClaimId"],
    responses: [
      "Your claim CLM001 is approved.",
      "Your claim CLM001 is rejected.",
      "Your claim CLM001 is pending.",
      "Your claim CLM001 is under review.",
      "Your claim CLM001 is being processed.",
      "Your claim CLM001 is closed.",
      "Your claim CLM001 is open.",
      "Your claim CLM001 is awaiting documents.",
      "Your claim CLM001 has been paid.",
      "Your claim CLM001 is pending feedback.",
      "Your claim CLM001 is being followed up.",
      "Your claim CLM001 status is available.",
      "Your claim CLM001 reference number is CLM001.",
      "Your claim CLM001 was submitted on 2020-02-02.",
      "Your claim CLM001 was paid KES 11042.03.",
      "Your claim CLM001 is assigned to an agent.",
      "Your claim CLM001 is pending review.",
      "Your claim CLM001 is being investigated.",
      "Your claim CLM001 is awaiting approval.",
      "Your claim CLM001 feedback has been received."
    ]
  },
  {
    id: "SurveyPoll",
    intentName: "SurveyPoll",
    displayName: "Survey Poll",
    trainingPhrases: [
      "Take my survey",
      "I want to do the poll",
      "Can I give feedback?",
      "How do I rate your service?",
      "Can I participate in a survey?",
      "I want to answer questions",
      "Send me a survey link",
      "How do I submit a poll?",
      "Can I review your service?",
      "I want to complete a survey",
      "Can I do a customer poll?",
      "How do I provide feedback?",
      "Can I rate my experience?",
      "I want to fill out a survey",
      "Can I get a survey form?",
      "How do I access the poll?",
      "Can I do a satisfaction survey?",
      "I want to give my opinion",
      "Can I do a quick survey?",
      "How do I submit my feedback?"
    ],
    parameters: [],
    responses: [
      "Thank you for participating in our survey.",
      "Your feedback is valuable.",
      "Survey link has been sent to your email.",
      "You can rate our service online.",
      "Your poll response has been recorded.",
      "You can complete the survey now.",
      "Your feedback has been submitted.",
      "You can access the poll via the app.",
      "Your survey form is available.",
      "Your satisfaction survey is ready.",
      "Your opinion has been received.",
      "You can do a quick survey online.",
      "Your feedback is being processed.",
      "You can review our service anytime.",
      "Your survey response is pending.",
      "You can fill out the survey now.",
      "Your survey form has been sent.",
      "You can access the poll link.",
      "Your feedback is under review.",
      "Thank you for your feedback."
    ]
  },
  // Add more intents as needed, following the same structure
];

// --- CUSTOMERS (from your customers.json) ---
const customers = [
  { customerId: "CUST001", name: "Customer 1", phone: "+254767296809", email: "customer1@hakikisha.example.com" },
  { customerId: "CUST002", name: "Customer 2", phone: "+254771791841", email: "customer2@hakikisha.example.com" },
  // ...add all customers from your file
];

// --- POLICIES (from your policies.json) ---
const policies = [
  { policyNumber: "PN100001", customerId: "CUST001", status: "Lapsed", startDate: "2024-02-02", expiryDate: "2028-02-02", premium: 352.58, product: "Comprehensive Auto" },
  { policyNumber: "PN100002", customerId: "CUST002", status: "Cancelled", startDate: "2021-06-14", expiryDate: "2025-06-14", premium: 558.78, product: "Home Owner" },
  // ...add all policies from your file
];

// --- INTENT MATCHING FUNCTION ---
function matchIntent(message) {
  for (const intent of intents) {
    if (intent.trainingPhrases.some(phrase => message.toLowerCase().includes(phrase.toLowerCase()))) {
      return intent.responses[Math.floor(Math.random() * intent.responses.length)];
    }
  }
  return "Sorry, I didn't understand that. Can you rephrase?";
}

// --- CHAT ROUTE ---
app.post('/chat', async (req, res) => {
  const { userId, message } = req.body;
  const response = matchIntent(message);

  // Log to Cosmos DB
  const container = await getChatContainer();
  await container.items.create({ userId, message, response, timestamp: new Date().toISOString() });

  res.json({ reply: response });
});

// --- CUSTOMER LOOKUP ROUTE ---
app.get('/customer/:id', (req, res) => {
  const customer = customers.find(c => c.customerId === req.params.id);
  if (!customer) return res.status(404).send('Customer not found');
  res.json(customer);
});

// --- POLICY LOOKUP ROUTE ---
app.get('/policy/:policyNumber', (req, res) => {
  const policy = policies.find(p => p.policyNumber === req.params.policyNumber);
  if (!policy) return res.status(404).send('Policy not found');
  res.json(policy);
});

// --- LOG CHAT ROUTE (as in your original script) ---
app.post('/log-chat', async (req, res) => {
  console.log('Received POST /log-chat');
  console.log('Request body:', req.body);

  const timeoutMs = 10000;
  let timeoutHandle;
  let responded = false;

  try {
    timeoutHandle = setTimeout(() => {
      if (!responded) {
        responded = true;
        console.error('❌ Cosmos DB operation timed out');
        res.status(504).send('Cosmos DB operation timed out');
      }
    }, timeoutMs);

    const container = await getChatContainer();
    const chatEntry = req.body;

    // Validate request body
    if (!chatEntry.userId || !chatEntry.message || !chatEntry.timestamp) {
      clearTimeout(timeoutHandle);
      return res.status(400).send('Missing required fields: userId, message, timestamp');
    }

    console.log('Inserting chat entry into Cosmos DB:', chatEntry);
    const { resource } = await container.items.create(chatEntry);

    if (!responded) {
      responded = true;
      clearTimeout(timeoutHandle);
      res.status(201).json(resource);
    }
  } catch (error) {
    if (!responded) {
      responded = true;
      clearTimeout(timeoutHandle);
      console.error('❌ Error logging chat:', error.message);
      res.status(500).send('Failed to log chat: ' + error.message);
    }
  }
});

// --- HEALTH CHECK ROUTE ---
app.get('/', (req, res) => {
  res.send('Hakikisha Insurance Assistant Server is running!');
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});