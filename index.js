require('dotenv').config();
const express = require('express');
const { CosmosClient } = require('@azure/cosmos');
const cors = require('cors'); // Added CORS
const app = express();
app.use(cors()); // Enable CORS
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

// ---------- PAYMENTS ----------
const payments = [
  { id: "PAY100001", policyNumber: "PN100001", dueDate: "2024-08-24", amount: 352.58, status: "Paid", createdAt: "2021-05-30" },
  { id: "PAY100002", policyNumber: "PN100002", dueDate: "2026-12-08", amount: 558.78, status: "Pending", createdAt: "2023-02-03" },
  { id: "PAY100003", policyNumber: "PN100003", dueDate: "2024-12-26", amount: 317.48, status: "Paid", createdAt: "2023-12-17" },
  { id: "PAY100004", policyNumber: "PN100004", dueDate: "2024-11-24", amount: 1098.86, status: "Overdue", createdAt: "2022-02-07" },
  { id: "PAY100005", policyNumber: "PN100005", dueDate: "2026-08-20", amount: 666.58, status: "Overdue", createdAt: "2021-05-19" },
  { id: "PAY100006", policyNumber: "PN100006", dueDate: "2025-02-24", amount: 855.7, status: "Overdue", createdAt: "2023-09-21" },
  { id: "PAY100007", policyNumber: "PN100007", dueDate: "2025-01-11", amount: 325.35, status: "Overdue", createdAt: "2023-04-12" },
  { id: "PAY100008", policyNumber: "PN100008", dueDate: "2025-04-17", amount: 1314.94, status: "Pending", createdAt: "2021-01-09" },
  { id: "PAY100009", policyNumber: "PN100009", dueDate: "2024-08-13", amount: 236.36, status: "Paid", createdAt: "2025-12-28" },
  { id: "PAY100010", policyNumber: "PN100010", dueDate: "2026-10-13", amount: 1466.47, status: "Paid", createdAt: "2025-04-11" },
  { id: "PAY100011", policyNumber: "PN100011", dueDate: "2025-02-09", amount: 756.82, status: "Pending", createdAt: "2022-06-12" },
  { id: "PAY100012", policyNumber: "PN100012", dueDate: "2024-04-17", amount: 840.61, status: "Overdue", createdAt: "2024-07-01" },
  { id: "PAY100013", policyNumber: "PN100013", dueDate: "2026-07-14", amount: 608.77, status: "Paid", createdAt: "2025-05-08" },
  { id: "PAY100014", policyNumber: "PN100014", dueDate: "2026-09-21", amount: 1236.31, status: "Pending", createdAt: "2025-05-26" },
  { id: "PAY100015", policyNumber: "PN100015", dueDate: "2024-07-31", amount: 625.51, status: "Paid", createdAt: "2021-06-16" },
  { id: "PAY100016", policyNumber: "PN100016", dueDate: "2024-10-07", amount: 725.11, status: "Overdue", createdAt: "2025-05-24" },
  { id: "PAY100017", policyNumber: "PN100017", dueDate: "2026-04-21", amount: 1068.18, status: "Overdue", createdAt: "2021-06-06" },
  { id: "PAY100018", policyNumber: "PN100018", dueDate: "2026-11-16", amount: 542.51, status: "Paid", createdAt: "2020-03-29" },
  { id: "PAY100019", policyNumber: "PN100019", dueDate: "2026-06-09", amount: 389.88, status: "Paid", createdAt: "2021-04-28" },
  { id: "PAY100020", policyNumber: "PN100020", dueDate: "2026-01-30", amount: 1308.02, status: "Pending", createdAt: "2025-04-14" }
];

// ---------- MATCHING LOGIC ----------
function matchIntent(message) {
  // Welcome intent
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(message)) {
    return "Hello! Welcome to Hakikisha Insurance. How can I assist you today?";
  }
  // Goodbye intent
  if (/\b(bye|goodbye|see you|farewell|thanks|thank you)\b/i.test(message)) {
    return "Goodbye! Have a great day!";
  }
  // Default response
  return "I'm sorry, I didn't understand that. Can you please rephrase?";
}

// ---------- API ENDPOINTS ----------
app.get('/', (req, res) => {
  res.send('Welcome to the Hakikisha Insurance API');
});

// Customers
app.get('/customers', async (req, res) => {
  const container = await getChatContainer();
  const query = 'SELECT * FROM c WHERE c.type = "customer"';
  const { resources: customers } = await container.items.query(query).fetchAll();
  res.json(customers);
});

app.post('/customers', async (req, res) => {
  const container = await getChatContainer();
  const customer = req.body;
  customer.type = "customer";
  const { resource: createdCustomer } = await container.items.create(customer);
  res.status(201).json(createdCustomer);
});

// Policies
app.get('/policies', async (req, res) => {
  const container = await getChatContainer();
  const query = 'SELECT * FROM c WHERE c.type = "policy"';
  const { resources: policies } = await container.items.query(query).fetchAll();
  res.json(policies);
});

app.post('/policies', async (req, res) => {
  const container = await getChatContainer();
  const policy = req.body;
  policy.type = "policy";
  const { resource: createdPolicy } = await container.items.create(policy);
  res.status(201).json(createdPolicy);
});

// Claims
app.get('/claims', async (req, res) => {
  const container = await getChatContainer();
  const query = 'SELECT * FROM c WHERE c.type = "claim"';
  const { resources: claims } = await container.items.query(query).fetchAll();
  res.json(claims);
});

app.post('/claims', async (req, res) => {
  const container = await getChatContainer();
  const claim = req.body;
  claim.type = "claim";
  const { resource: createdClaim } = await container.items.create(claim);
  res.status(201).json(createdClaim);
});

// Payments
app.get('/payments', async (req, res) => {
  const container = await getChatContainer();
  const query = 'SELECT * FROM c WHERE c.type = "payment"';
  const { resources: payments } = await container.items.query(query).fetchAll();
  res.json(payments);
});

app.post('/payments', async (req, res) => {
  const container = await getChatContainer();
  const payment = req.body;
  payment.type = "payment";
  const { resource: createdPayment } = await container.items.create(payment);
  res.status(201).json(createdPayment);
});

// Chatbot
app.post('/chat', (req, res) => {
  const { message } = req.body;
  const response = matchIntent(message);
  res.json({ response });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});