import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { Client } from '@elastic/elasticsearch';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json()); // Add middleware to parse JSON

const PORT = process.env.PORT || 5000;

// Elasticsearch client setup
const esClient = new Client({ node: 'http://elasticsearch:9200' });

// Test Elasticsearch connection
esClient.ping({}, { requestTimeout: 3000 }, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!', error);
  } else {
    console.log('Elasticsearch is connected');
  }
});

// Route to save a message
app.post('/messages', async (req, res) => {
  const { message, user } = req.body;
  try {
    const response = await esClient.index({
      index: 'messages',
      body: {
        user,
        message,
        timestamp: new Date()
      }
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to save message');
  }
});

// Route to search messages
app.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const { body } = await esClient.search({
      index: 'messages',
      body: {
        query: {
          match: { message: q }
        }
      }
    });
    res.json(body.hits.hits);
  } catch (error) {
    console.error(error);
    res.status(500).send('Search failed');
  }
});

io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded', { id: socket.id });
  });

  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
