require('dotenv').config(); // ✅ Load .env variables first

const express = require('express');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
app.use(express.json());

// ✅ Cosmos DB Config from environment variables
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;

// ✅ Validate environment variables
if (!endpoint || !key || !databaseId || !containerId) {
  console.error('❌ Missing Cosmos DB credentials or config. Check your .env file.');
  console.log({ endpoint, key: key ? 'Loaded' : 'Missing', databaseId, containerId });
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

    // ✅ Validate request body
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

// ✅ Root route for health check
app.get('/', (req, res) => {
  res.send('Hakikisha Insurance Assistant Server is running!');
});

// ✅ Dynamic port for Render or local fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});