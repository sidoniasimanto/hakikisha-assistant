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

// ---------- CUSTOMERS ----------
const customers = [
  { customerId: "CUST001", name: "Alice Johnson", phone: "+254700000001", email: "alice.johnson@example.com" },
  { customerId: "CUST002", name: "Bob Smith", phone: "+254700000002", email: "bob.smith@example.com" },
  { customerId: "CUST003", name: "Charlie Brown", phone: "+254700000003", email: "charlie.brown@example.com" },
  { customerId: "CUST004", name: "Diana Prince", phone: "+254700000004", email: "diana.prince@example.com" },
  { customerId: "CUST005", name: "Edward Green", phone: "+254700000005", email: "edward.green@example.com" },
  { customerId: "CUST006", name: "Fiona White", phone: "+254700000006", email: "fiona.white@example.com" },
  { customerId: "CUST007", name: "George Black", phone: "+254700000007", email: "george.black@example.com" },
  { customerId: "CUST008", name: "Hannah Blue", phone: "+254700000008", email: "hannah.blue@example.com" },
  { customerId: "CUST009", name: "Ian Gray", phone: "+254700000009", email: "ian.gray@example.com" },
  { customerId: "CUST010", name: "Julia Rose", phone: "+254700000010", email: "julia.rose@example.com" },
  { customerId: "CUST011", name: "Kevin Brown", phone: "+254700000011", email: "kevin.brown@example.com" },
  { customerId: "CUST012", name: "Laura Green", phone: "+254700000012", email: "laura.green@example.com" },
  { customerId: "CUST013", name: "Michael White", phone: "+254700000013", email: "michael.white@example.com" },
  { customerId: "CUST014", name: "Nina Black", phone: "+254700000014", email: "nina.black@example.com" },
  { customerId: "CUST015", name: "Oscar Blue", phone: "+254700000015", email: "oscar.blue@example.com" },
  { customerId: "CUST016", name: "Paula Gray", phone: "+254700000016", email: "paula.gray@example.com" },
  { customerId: "CUST017", name: "Quentin Rose", phone: "+254700000017", email: "quentin.rose@example.com" },
  { customerId: "CUST018", name: "Rachel Green", phone: "+254700000018", email: "rachel.green@example.com" },
  { customerId: "CUST019", name: "Steve White", phone: "+254700000019", email: "steve.white@example.com" },
  { customerId: "CUST020", name: "Tina Black", phone: "+254700000020", email: "tina.black@example.com" }
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

// ---------- MATCHING LOGIC ----------
function matchIntent(message) {
  const custMatch = message.match(/CUST\d{3}/i);
  if (custMatch) {
    const customer = customers.find(c => c.customerId === custMatch[0].toUpperCase());
    if (customer) {
      const policy = policies.find(p => p.customerId === customer.customerId);
      return `Customer ${customer.name} (${customer.customerId}) has policy ${policy.policyNumber}. Status: ${policy.status}, Product: ${policy.product}.`;
    }
  }

  const policyMatch = message.match(/PN\d{6}/i);
  if (policyMatch) {
    const policy = policies.find(p => p.policyNumber === policyMatch[0].toUpperCase());
    if (policy) {
      const customer = customers.find(c => c.customerId === policy.customerId);
      return `Policy ${policy.policyNumber} belongs to ${customer.name}. Status: ${policy.status}, Premium: KES ${policy.premium}, Expiry: ${policy.expiryDate}.`;
    }
  }

  const claimMatch = message.match(/CLM\d{4}/i);
  if (claimMatch) {
    const claim = claims.find(cl => cl.claimId === claimMatch[0].toUpperCase());
    if (claim) {
      const policy = policies.find(p => p.policyNumber === claim.policyNumber);
      const customer = customers.find(c => c.customerId === policy.customerId);
      return `Claim ${claim.claimId} for ${customer.name} (${policy.policyNumber}) is ${claim.status}. Amount: KES ${claim.amount}, Description: ${claim.description}.`;
    }
  }

  return "Sorry, I didn't understand that. Please provide a valid customer ID, policy number, or claim ID.";
}

// ---------- Dialogflow Webhook ----------
app.post('/webhook', async (req, res) => {
  const userMessage = req.body.queryResult.queryText;
  const userId = req.body.session || "unknown";

  const responseText = matchIntent(userMessage);

  const container = await getChatContainer();
  await container.items.create({ userId, message: userMessage, response: responseText, timestamp: new Date().toISOString() });

  res.json({ fulfillmentText: responseText });
});

// ---------- Health Check ----------
app.get('/', (req, res) => res.send('Hakikisha Insurance Assistant Server is running!'));

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));