const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const WebSocket = require('ws');

// Create an Express app
const app = express();
const port = 3000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection URL (Replace <username> and <password> with your Atlas credentials)
const url = 'mongodb+srv://vikassangwan652:vikas12@cluster0.tsjn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);

// Database Name
const dbName = 'ChatDb';

let db;

// Connect to MongoDB Atlas and run the server
async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas');

    db = client.db(dbName);
    const userCollection = db.collection('users');

    // Start the Express server
    // app.listen(port, () => {
    //   console.log(`Server running at http://localhost:${port}`);
    // });
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);

// Create an HTTP server to use with WebSocket
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  

// API to fetch user data/ create User data
app.post('/api/login', async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
  
    try {
      // Check if the user already exists in the collection
      const user = await db.collection('users').findOne({ name });
  
      if (user) {
        // If user exists, return the user ID and name
        res.json({ id: user._id, name: user.name });
      } else {
        // If user doesn't exist, create a new user with a unique ID
        const newUser = {
          name,
          createdAt: new Date(),
        };
  
        const result = await db.collection('users').insertOne(newUser);
        
        // Return the newly created user ID and name
        res.json({ id: result.insertedId, name: newUser.name });
      }
    } catch (error) {
      console.error('Error fetching or creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API to fetch all users' names
app.get('/api/users', async (req, res) => {
    try {
      // Fetch all users and project only the "name" field
      const users = await db.collection('users').find({}, { projection: { name: 1, _id: 1 } }).toArray();
    //   const userNames = users.map(user => user.name);
      // Return the list of names
      res.json(users);
    } catch (error) {
      console.error('Error fetching user names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); 
  

// Helper to generate a unique collection name for two users
const getChatCollectionName = (user1, user2) => {
  return `chat_${[user1, user2].sort().join('_')}`;
};

// On WebSocket connection
const oneToOneServer = new WebSocket.Server({ port: 3001 });

oneToOneServer.on('connection', ws => {
    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message);
      const { user1, user2, userName, message: userMessage, timeStamp } = parsedMessage;
  
      if (!user1 || !user2) {
        ws.send(JSON.stringify({ error: 'Both users must be provided' }));
        return;
      }
  
      // Get the chat collection for the two users
      const chatCollectionName = getChatCollectionName(user1, user2);
      const chatCollection = db.collection(chatCollectionName);
  
      try {
        // Save the message to MongoDB
        await chatCollection.insertOne({ userName, message: userMessage, timeStamp });
  
        // Fetch the chat history
        const chatHistory = await chatCollection.find().toArray();
  
        // Broadcast the message to the clients
        oneToOneServer.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(chatHistory));
          }
        });
  
      } catch (err) {
        console.error('Error handling chat:', err);
        ws.send(JSON.stringify({ error: 'Error handling chat' }));
      }
    });
  });

// Group Chat WebSocket Server
const groupChatServer = new WebSocket.Server({ port: 3002 });

groupChatServer.on('connection', async (ws) => {
    const defaultGroupName = 'group-1'; // or retrieve this dynamically
    const groupCollection = db.collection(defaultGroupName);

  try {
    // Fetch the group chat history from the database
    const groupHistory = await groupCollection.find().toArray();

    // Send the chat history to the connected client
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(groupHistory));
    }
  } catch (error) {
    console.error('Error fetching group chat history:', error);
    ws.send(JSON.stringify({ error: 'Failed to load group chat history.' }));
  }
  
  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message);
    const { groupName, userName, userMessage, timeStamp } = parsedMessage;

    // Save the group message to the database
    const groupCollection = db.collection(groupName);
    await groupCollection.insertOne({ userName, userMessage, timeStamp });

      // Fetch the chat history
    const groupHistory = await groupCollection.find().toArray();
    // Broadcast the message to all clients in the group
    groupChatServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(groupHistory));
      }
    });
  });
});

  
  // HTTP route for health check
  app.get('/', (req, res) => {
    res.send('WebSocket server is running');
  });
  
// Define API route to fetch latest 50 chat entries between two users
app.get('/api/getChats', async (req, res) => {
    const user1 = req.query.user1;
    const user2 = req.query.user2;
  
    if (!user1 || !user2) {
      return res.status(400).json({ error: 'Both user1 and user2 are required' });
    }
  
    try {
      // Find chats between user1 and user2 in either direction (sender/receiver)
      const chatCollectionName = getChatCollectionName(user1, user2);
      const chatCollection = db.collection(chatCollectionName);
  
      const chats = await chatCollection.find()
      .limit(50)  // Limit to latest 50 entries
      .toArray();
  
      res.json(chats);
    } catch (error) {
      console.error('Error fetching chat:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  