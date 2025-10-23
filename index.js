require('dotenv').config(); // Load .env variables

const express = require('express');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
app.use(express.json());

// ✅ Cosmos DB Config from environment variables (matching .env)
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;

if (!endpoint || !key || !databaseId || !containerId) {
  console.error('❌ Missing Cosmos DB credentials or config. Check your .env file.');
  process.exit(1);
}

// ✅ Initialise Cosmos Client
const client = new CosmosClient({ endpoint, key });

// ✅ Get or create container
async function getChatContainer() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  const { container } = await database.containers.createIfNotExists({ id: containerId });
  return container;
}

// ✅ Route to log chat messages
app.post('/log-chat', async (req, res) => {
  try {
    const container = await getChatContainer();
    const chatEntry = req.body; // Expect userId, message, timestamp

    const { resource } = await container.items.create(chatEntry);
    res.status(201).json(resource);
  } catch (error) {
    console.error('❌ Error logging chat:', error.message);
    res.status(500).send('Failed to log chat');
  }
});

// Add a GET route for the root path
app.get('/', (req, res) => {
  res.send('Hakikisha Insurance Assistant Server is running!');
});

// ✅ Dynamic port for Render or local fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});