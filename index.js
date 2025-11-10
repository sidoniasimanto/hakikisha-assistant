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

// ---------- CUSTOMERS WITH PINS ----------
const customers = [
  { customerId: "CUST001", name: "Alice Johnson", phone: "+254700000001", email: "alice.johnson@example.com", pin: "1234" },
  { customerId: "CUST002", name: "Bob Smith", phone: "+254700000002", email: "bob.smith@example.com", pin: "5678" },
  { customerId: "CUST003", name: "Charlie Brown", phone: "+254700000003", email: "charlie.brown@example.com", pin: "9012" },
  { customerId: "CUST004", name: "Diana Prince", phone: "+254700000004", email: "diana.prince@example.com", pin: "3456" },
  { customerId: "CUST005", name: "Edward Green", phone: "+254700000005", email: "edward.green@example.com", pin: "7890" },
  { customerId: "CUST006", name: "Fiona White", phone: "+254700000006", email: "fiona.white@example.com", pin: "2345" },
  { customerId: "CUST007", name: "George Black", phone: "+254700000007", email: "george.black@example.com", pin: "6789" },
  { customerId: "CUST008", name: "Hannah Blue", phone: "+254700000008", email: "hannah.blue@example.com", pin: "0123" },
  { customerId: "CUST009", name: "Ian Gray", phone: "+254700000009", email: "ian.gray@example.com", pin: "4567" },
  { customerId: "CUST010", name: "Julia Rose", phone: "+254700000010", email: "julia.rose@example.com", pin: "8901" },
  { customerId: "CUST011", name: "Kevin Brown", phone: "+254700000011", email: "kevin.brown@example.com", pin: "1357" },
  { customerId: "CUST012", name: "Laura Green", phone: "+254700000012", email: "laura.green@example.com", pin: "2468" },
  { customerId: "CUST013", name: "Michael White", phone: "+254700000013", email: "michael.white@example.com", pin: "3691" },
  { customerId: "CUST014", name: "Nina Black", phone: "+254700000014", email: "nina.black@example.com", pin: "4702" },
  { customerId: "CUST015", name: "Oscar Blue", phone: "+254700000015", email: "oscar.blue@example.com", pin: "5813" },
  { customerId: "CUST016", name: "Paula Gray", phone: "+254700000016", email: "paula.gray@example.com", pin: "6924" },
  { customerId: "CUST017", name: "Quentin Rose", phone: "+254700000017", email: "quentin.rose@example.com", pin: "7035" },
  { customerId: "CUST018", name: "Rachel Green", phone: "+254700000018", email: "rachel.green@example.com", pin: "8146" },
  { customerId: "CUST019", name: "Steve White", phone: "+254700000019", email: "steve.white@example.com", pin: "9257" },
  { customerId: "CUST020", name: "Tina Black", phone: "+254700000020", email: "tina.black@example.com", pin: "1368" }
];

// ---------- POLICIES ----------
const policies = [
  { policyNumber: "PN100001", customerId: "CUST001", status: "Active", startDate: "2024-01-01", expiryDate: "2028-01-01", premium: 350.00, product: "Comprehensive Auto" },
  { policyNumber: "PN100002", customerId: "CUST002", status: "Active", startDate: "2023-02-01", expiryDate: "2027-02-01", premium: 420.00, product: "Home Owner" },
  { policyNumber: "PN100003", customerId: "CUST003", status: "Cancelled", startDate: "2022-03-01", expiryDate: "2026-03-01", premium: 500.00, product: "Health Basic" },
  { policyNumber: "PN100004", customerId: "CUST004", status: "Active", startDate: "2024-04-01", expiryDate: "2028-04-01", premium: 600.00, product: "Travel Insurance" },
  { policyNumber: "PN100005", customerId: "CUST005", status: "Active", startDate: "2023-05-01", expiryDate: "2027-05-01", premium: 700.00, product: "Comprehensive Auto" },
  { policyNumber: "PN100006", customerId: "CUST006", status: "Active", startDate: "2024-06-01", expiryDate: "2028-06-01", premium: 800.00, product: "Home Owner" },
  { policyNumber: "PN100007", customerId: "CUST007", status: "Cancelled", startDate: "2022-07-01", expiryDate: "2026-07-01", premium: 900.00, product: "Health Plus" },
  { policyNumber: "PN100008", customerId: "CUST008", status: "Active", startDate: "2024-08-01", expiryDate: "2028-08-01", premium: 1000.00, product: "Travel Insurance" },
  { policyNumber: "PN100009", customerId: "CUST009", status: "Active", startDate: "2023-09-01", expiryDate: "2027-09-01", premium: 1100.00, product: "Comprehensive Auto" },
  { policyNumber: "PN100010", customerId: "CUST010", status: "Active", startDate: "2024-10-01", expiryDate: "2028-10-01", premium: 1200.00, product: "Home Owner" },
  { policyNumber: "PN100011", customerId: "CUST011", status: "Active", startDate: "2023-11-01", expiryDate: "2027-11-01", premium: 1300.00, product: "Health Basic" },
  { policyNumber: "PN100012", customerId: "CUST012", status: "Active", startDate: "2024-12-01", expiryDate: "2028-12-01", premium: 1400.00, product: "Travel Insurance" },
  { policyNumber: "PN100013", customerId: "CUST013", status: "Active", startDate: "2023-01-01", expiryDate: "2027-01-01", premium: 1500.00, product: "Comprehensive Auto" },
  { policyNumber: "PN100014", customerId: "CUST014", status: "Active", startDate: "2024-02-01", expiryDate: "2028-02-01", premium: 1600.00, product: "Home Owner" },
  { policyNumber: "PN100015", customerId: "CUST015", status: "Active", startDate: "2023-03-01", expiryDate: "2027-03-01", premium: 1700.00, product: "Health Plus" },
  { policyNumber: "PN100016", customerId: "CUST016", status: "Active", startDate: "2024-04-01", expiryDate: "2028-04-01", premium: 1800.00, product: "Travel Insurance" },
  { policyNumber: "PN100017", customerId: "CUST017", status: "Active", startDate: "2023-05-01", expiryDate: "2027-05-01", premium: 1900.00, product: "Comprehensive Auto" },
  { policyNumber: "PN100018", customerId: "CUST018", status: "Active", startDate: "2024-06-01", expiryDate: "2028-06-01", premium: 2000.00, product: "Home Owner" },
  { policyNumber: "PN100019", customerId: "CUST019", status: "Active", startDate: "2023-07-01", expiryDate: "2027-07-01", premium: 2100.00, product: "Health Basic" },
  { policyNumber: "PN100020", customerId: "CUST020", status: "Active", startDate: "2024-08-01", expiryDate: "2028-08-01", premium: 2200.00, product: "Travel Insurance" }
];

// ---------- CLAIMS ----------
const claims = [
  { claimId: "CLM0001", policyNumber: "PN100001", status: "Approved", amount: 5000, description: "Fire damage" },
  { claimId: "CLM0002", policyNumber: "PN100002", status: "Rejected", amount: 3000, description: "Property damage" },
  { claimId: "CLM0003", policyNumber: "PN100003", status: "Pending", amount: 4000, description: "Medical expenses" },
  { claimId: "CLM0004", policyNumber: "PN100004", status: "Approved", amount: 2500, description: "Accident damage" },
  { claimId: "CLM0005", policyNumber: "PN100005", status: "Rejected", amount: 3500, description: "Flood damage" },
  { claimId: "CLM0006", policyNumber: "PN100006", status: "Approved", amount: 4500, description: "Fire damage" },
  { claimId: "CLM0007", policyNumber: "PN100007", status: "Pending", amount: 2000, description: "Medical expenses" },
  { claimId: "CLM0008", policyNumber: "PN100008", status: "Approved", amount: 6000, description: "Accident damage" },
  { claimId: "CLM0009", policyNumber: "PN100009", status: "Rejected", amount: 1500, description: "Property damage" },
  { claimId: "CLM0010", policyNumber: "PN100010", status: "Approved", amount: 7000, description: "Fire damage" },
  { claimId: "CLM0011", policyNumber: "PN100011", status: "Pending", amount: 3200, description: "Medical expenses" },
  { claimId: "CLM0012", policyNumber: "PN100012", status: "Approved", amount: 8000, description: "Accident damage" },
  { claimId: "CLM0013", policyNumber: "PN100013", status: "Rejected", amount: 2700, description: "Flood damage" },
  { claimId: "CLM0014", policyNumber: "PN100014", status: "Approved", amount: 9000, description: "Fire damage" },
  { claimId: "CLM0015", policyNumber: "PN100015", status: "Pending", amount: 3300, description: "Medical expenses" },
  { claimId: "CLM0016", policyNumber: "PN100016", status: "Approved", amount: 10000, description: "Accident damage" },
  { claimId: "CLM0017", policyNumber: "PN100017", status: "Rejected", amount: 2800, description: "Property damage" },
  { claimId: "CLM0018", policyNumber: "PN100018", status: "Approved", amount: 11000, description: "Fire damage" },
  { claimId: "CLM0019", policyNumber: "PN100019", status: "Pending", amount: 3400, description: "Medical expenses" },
  { claimId: "CLM0020", policyNumber: "PN100020", status: "Approved", amount: 12000, description: "Accident damage" }
];

// ---------- AUTHENTICATION SESSION MANAGEMENT ----------
const authSessions = {}; // { sessionId: { authenticatedCustomerId, pinAttempts, lastActivity } }
const feedbackData = [];
const feedbackSessions = {};

// ---------- FEEDBACK HELPER FUNCTIONS ----------
function analyzeSentiment(text) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'helpful', 'quick', 'fast', 'satisfied', 'happy', 'love', 'best', 'perfect', 'smooth', 'easy', 'professional'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'slow', 'unhelpful', 'disappointed', 'frustrated', 'angry', 'worst', 'horrible', 'useless', 'waste', 'confused', 'difficult', 'problem'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractRating(message) {
  const patterns = [
    /(?:rate|rating|give|score)?\s*[:=]?\s*([1-5])(?:\/5|\s*stars?|\s*out of 5)?/i,
    /([1-5])\s*(?:stars?|\/5|out of 5)/i,
  ];
  
  for (let pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const rating = parseInt(match[1]);
      if (rating >= 1 && rating <= 5) return rating;
    }
  }
  
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.match(/excellent|amazing|perfect/)) return 5;
  if (lowerMsg.match(/good|satisfied|happy/)) return 4;
  if (lowerMsg.match(/okay|fine|average|decent/)) return 3;
  if (lowerMsg.match(/poor|bad|unsatisfied/)) return 2;
  if (lowerMsg.match(/terrible|awful|worst/)) return 1;
  
  return null;
}

function categorizeFeedback(comments) {
  const categories = [];
  const lowerComments = comments.toLowerCase();
  
  if (lowerComments.match(/speed|fast|slow|quick|time|wait|delay/)) categories.push('response-time');
  if (lowerComments.match(/helpful|help|support|assist|service/)) categories.push('service-quality');
  if (lowerComments.match(/easy|difficult|simple|complicated|understand|confus/)) categories.push('user-experience');
  if (lowerComments.match(/information|info|detail|explain|clear/)) categories.push('information-clarity');
  if (lowerComments.match(/claim|policy|process|procedure/)) categories.push('process-efficiency');
  if (lowerComments.match(/friendly|professional|rude|polite|attitude/)) categories.push('staff-behavior');
  
  return categories.length > 0 ? categories : ['general'];
}

// ---------- SESSION MANAGEMENT ----------
function isAuthenticated(sessionId) {
  return authSessions[sessionId] && authSessions[sessionId].authenticatedCustomerId;
}

function getAuthenticatedCustomer(sessionId) {
  return authSessions[sessionId]?.authenticatedCustomerId || null;
}

function endSession(sessionId) {
  delete authSessions[sessionId];
  delete feedbackSessions[sessionId];
  console.log(`🔒 Session ended: ${sessionId}`);
}

// ---------- MATCHING LOGIC WITH PIN AUTHENTICATION ----------
function matchIntent(message, sessionId) {
  const lowerMsg = message.toLowerCase().trim();
  
  // Check for session termination commands
  if (lowerMsg === 'bye' || lowerMsg === 'goodbye' || lowerMsg === 'exit' || lowerMsg === 'quit' || lowerMsg === 'end') {
    endSession(sessionId);
    return "Thank you for using Hakikisha Insurance! Your session has been ended. Have a great day! 👋";
  }
  
  // Check if user is in an active feedback session
  if (feedbackSessions[sessionId] && feedbackSessions[sessionId].active) {
    const feedbackResponse = handleFeedbackConversation(message, sessionId);
    // If feedback is completed, end the session
    if (!feedbackSessions[sessionId] || !feedbackSessions[sessionId].active) {
      endSession(sessionId);
    }
    return feedbackResponse;
  }
  
  // Check if waiting for PIN verification
  if (authSessions[sessionId] && authSessions[sessionId].waitingForPin) {
    const enteredPin = message.trim();
    const requestedCustomerId = authSessions[sessionId].requestedCustomerId;
    const customer = customers.find(c => c.customerId === requestedCustomerId);
    
    if (!customer) {
      delete authSessions[sessionId];
      return "Session error. Please try again.";
    }
    
    if (enteredPin === customer.pin) {
      // Successful authentication
      authSessions[sessionId] = {
        authenticatedCustomerId: requestedCustomerId,
        waitingForPin: false,
        pinAttempts: 0,
        lastActivity: Date.now()
      };
      console.log(`✅ Authentication successful for ${requestedCustomerId}`);
      
      const policy = policies.find(p => p.customerId === customer.customerId);
      return `✅ Authentication successful! Welcome, ${customer.name}.\n\nHere are your details:\n\n📋 Customer ID: ${customer.customerId}\n📞 Phone: ${customer.phone}\n📧 Email: ${customer.email}\n\n📑 Policy Number: ${policy.policyNumber}\n📊 Status: ${policy.status}\n💼 Product: ${policy.product}\n💰 Premium: KES ${policy.premium}\n📅 Expiry Date: ${policy.expiryDate}\n\nYou can now ask for policy or claim information. Type 'bye' to end your session.`;
    } else {
      // Failed authentication
      authSessions[sessionId].pinAttempts = (authSessions[sessionId].pinAttempts || 0) + 1;
      
      if (authSessions[sessionId].pinAttempts >= 3) {
        delete authSessions[sessionId];
        return "❌ Too many incorrect PIN attempts. For security reasons, your session has been terminated. Please try again later or contact support at +254 700 000 000.";
      }
      
      return `❌ Incorrect PIN. Please try again. (Attempt ${authSessions[sessionId].pinAttempts}/3)`;
    }
  }
  
  // Customer ID lookup - Request PIN
  const custMatch = message.match(/CUST\d{3}/i);
  if (custMatch) {
    const requestedCustomerId = custMatch[0].toUpperCase();
    const customer = customers.find(c => c.customerId === requestedCustomerId);
    
    if (!customer) {
      return `Customer ID ${requestedCustomerId} not found. Please check and try again.`;
    }
    
    // Check if already authenticated for this customer
    if (isAuthenticated(sessionId) && getAuthenticatedCustomer(sessionId) === requestedCustomerId) {
      const policy = policies.find(p => p.customerId === customer.customerId);
      return `You are already viewing ${customer.name}'s account.\n\n📑 Policy Number: ${policy.policyNumber}\n📊 Status: ${policy.status}\n💼 Product: ${policy.product}\n💰 Premium: KES ${policy.premium}\n📅 Expiry Date: ${policy.expiryDate}`;
    }
    
    // Check if trying to access different customer while authenticated
    if (isAuthenticated(sessionId) && getAuthenticatedCustomer(sessionId) !== requestedCustomerId) {
      return `⚠️ You are currently authenticated as ${getAuthenticatedCustomer(sessionId)}. To access another customer's information, please end your current session by typing 'bye', then start a new query.`;
    }
    
    // Request PIN authentication
    authSessions[sessionId] = {
      requestedCustomerId: requestedCustomerId,
      waitingForPin: true,
      pinAttempts: 0,
      lastActivity: Date.now()
    };
    
    return `🔐 Security Verification Required\n\nTo access information for ${customer.name} (${requestedCustomerId}), please enter your 4-digit PIN.\n\n🔒 Your PIN is confidential and ensures your data privacy.\n\n(Note: For this demo, ${customer.name}'s PIN is: ${customer.pin})`;
  }

  // Policy lookup - requires authentication
  const policyMatch = message.match(/PN\d{6}/i);
  if (policyMatch) {
    const policyNumber = policyMatch[0].toUpperCase();
    const policy = policies.find(p => p.policyNumber === policyNumber);
    
    if (!policy) {
      return `Policy number ${policyNumber} not found. Please check and try again.`;
    }
    
    // Check if authenticated for this policy's customer
    if (!isAuthenticated(sessionId) || getAuthenticatedCustomer(sessionId) !== policy.customerId) {
      return `🔐 Access Denied: You must be authenticated as ${policy.customerId} to view this policy. Please provide your customer ID and PIN first.`;
    }
    
    const customer = customers.find(c => c.customerId === policy.customerId);
    return `Policy ${policy.policyNumber} belongs to ${customer.name}.\n\n📊 Status: ${policy.status}\n💰 Premium: KES ${policy.premium}\n📅 Start Date: ${policy.startDate}\n📅 Expiry Date: ${policy.expiryDate}\n💼 Product: ${policy.product}`;
  }

  // Claim lookup - requires authentication
  const claimMatch = message.match(/CLM\d{4}/i);
  if (claimMatch) {
    const claimId = claimMatch[0].toUpperCase();
    const claim = claims.find(cl => cl.claimId === claimId);
    
    if (!claim) {
      return `Claim ID ${claimId} not found. Please check and try again.`;
    }
    
    const policy = policies.find(p => p.policyNumber === claim.policyNumber);
    
    // Check if authenticated for this claim's customer
    if (!isAuthenticated(sessionId) || getAuthenticatedCustomer(sessionId) !== policy.customerId) {
      return `🔐 Access Denied: You must be authenticated as ${policy.customerId} to view this claim. Please provide your customer ID and PIN first.`;
    }
    
    const customer = customers.find(c => c.customerId === policy.customerId);
    return `Claim ${claim.claimId} for ${customer.name} (${policy.policyNumber})\n\n📊 Status: ${claim.status}\n💵 Amount: KES ${claim.amount}\n📝 Description: ${claim.description}`;
  }

  // Feedback intent
  const feedbackTriggers = ['feedback', 'review', 'rate', 'rating', 'survey', 'comment', 'complain', 'complaint', 'satisfied', 'satisfaction', 'experience', 'opinion', 'suggest', 'suggestion', 'improve', 'improvement', 'good service', 'bad service', 'thank you', 'thanks'];
  const hasFeedbackTrigger = feedbackTriggers.some(trigger => lowerMsg.includes(trigger));
  const hasRating = extractRating(message) !== null;
  
  if (hasFeedbackTrigger || hasRating) {
    feedbackSessions[sessionId] = {
      active: true,
      step: 'rating',
      rating: null,
      comments: null,
      startTime: new Date().toISOString()
    };
    
    const rating = extractRating(message);
    if (rating) {
      feedbackSessions[sessionId].rating = rating;
      feedbackSessions[sessionId].step = 'comments';
      return `Thank you for rating us ${rating} out of 5 stars! 🌟\n\nWe'd love to hear more about your experience. What specifically made you give this rating? (Or type 'skip' if you prefer not to comment)\n\nNote: Your session will end after submitting feedback.`;
    }
    
    return "We value your feedback! 😊\n\nOn a scale of 1 to 5 stars, how would you rate your experience with Hakikisha Insurance?\n\n⭐ 1 - Very Poor\n⭐⭐ 2 - Poor\n⭐⭐⭐ 3 - Average\n⭐⭐⭐⭐ 4 - Good\n⭐⭐⭐⭐⭐ 5 - Excellent\n\nSimply type a number from 1 to 5.\n\nNote: Your session will end after submitting feedback.";
  }

  return "Hello, Welcome to Hakikisha Insurance. Please provide a valid customer ID (e.g., CUST001) to begin. You'll need to verify your identity with a PIN to access your information.";
}

// Handle multi-turn feedback conversation
function handleFeedbackConversation(message, sessionId) {
  const session = feedbackSessions[sessionId];
  const lowerMsg = message.toLowerCase().trim();
  
  if (lowerMsg === 'cancel' || lowerMsg === 'exit' || lowerMsg === 'quit') {
    delete feedbackSessions[sessionId];
    return "Feedback cancelled. Feel free to provide feedback anytime by typing 'feedback'.";
  }
  
  if (session.step === 'rating') {
    const rating = extractRating(message);
    
    if (!rating) {
      return "Please provide a valid rating from 1 to 5. For example, type '5' for excellent service or '3' for average service.";
    }
    
    session.rating = rating;
    session.step = 'comments';
    
    const ratingEmoji = '⭐'.repeat(rating);
    return `Thank you for rating us ${rating} out of 5! ${ratingEmoji}\n\nWe'd love to hear more details about your experience. What went well? What could we improve? (Or type 'skip' to finish)`;
  }
  
  if (session.step === 'comments') {
    if (lowerMsg === 'skip') {
      session.comments = 'No additional comments provided';
    } else {
      session.comments = message.trim();
    }
    
    const sentiment = analyzeSentiment(session.comments);
    const categories = categorizeFeedback(session.comments);
    
    const feedback = {
      feedbackId: `FB${Date.now()}`,
      sessionId: sessionId,
      rating: session.rating,
      comments: session.comments,
      sentiment: sentiment,
      categories: categories,
      timestamp: new Date().toISOString(),
      duration: new Date() - new Date(session.startTime)
    };
    
    feedbackData.push(feedback);
    console.log('📝 Feedback received:', feedback);
    
    delete feedbackSessions[sessionId];
    
    let response = `✅ Thank you for your valuable feedback!\n\n`;
    response += `Your feedback ID is: ${feedback.feedbackId}\n\n`;
    
    if (session.rating >= 4) {
      response += `🎉 We're thrilled you had a positive experience with Hakikisha Insurance! Your satisfaction is our top priority, and we're grateful for your trust.\n\n`;
      if (session.comments !== 'No additional comments provided') {
        response += `We especially appreciate your comment: "${session.comments}"\n\n`;
      }
      response += `Thank you for being a valued customer!\n\n`;
    } else if (session.rating === 3) {
      response += `Thank you for your honest feedback. We understand there's room for improvement, and we're committed to serving you better.\n\n`;
      if (session.comments !== 'No additional comments provided') {
        response += `We've noted your comment: "${session.comments}"\n\n`;
      }
    } else {
      response += `😔 We sincerely apologize that we didn't meet your expectations. Your feedback is crucial in helping us improve.\n\n`;
      if (session.comments !== 'No additional comments provided') {
        response += `We've carefully recorded your comment: "${session.comments}"\n\n`;
      }
      response += `A customer service manager will review your feedback and may reach out to you directly. We're committed to making this right.\n\n`;
    }
    
    response += `Your session has been ended. Thank you for using Hakikisha Insurance! 👋`;
    
    return response;
  }
  
  return "I'm not sure what you mean. Please provide your feedback or type 'cancel' to exit.";
}

// ---------- Dialogflow Webhook ----------
app.post('/webhook', async (req, res) => {
  const userMessage = req.body.queryResult.queryText;
  const userId = req.body.session || "unknown";

  const responseText = matchIntent(userMessage, userId);

  const container = await getChatContainer();
  await container.items.create({ userId, message: userMessage, response: responseText, timestamp: new Date().toISOString() });

  res.json({ fulfillmentText: responseText });
});

// ---------- Health Check ----------
app.get('/', (req, res) => res.send('Hakikisha Insurance Assistant Server is running!'));

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));