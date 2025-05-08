const express = require('express');
const winston = require('winston');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// MongoDB URI from environment variable
const mongoURI = process.env.MONGO_URI || 'mongodb://mongoUser:mongoPassword@mongo-service:27017/admin';

if (!mongoURI) {
  throw new Error('MONGO_URI environment variable is not set');
}

// MongoDB connection using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

// Request logging
app.use((req, res, next) => {
  res.on('finish', () => {
    logger.info({
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      responseStatus: res.statusCode
    });
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  try {
    res.sendFile(__dirname + '/public/index.html');
  } catch (error) {
    logger.error(`Error serving index.html: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generic operation handler
function handleOperation(req, res, operation, calcFn) {
  try {
    const { num1, num2 } = req.query;
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || (operation !== 'sqrt' && isNaN(n2))) {
      throw new Error('Invalid numbers');
    }

    const result = calcFn(n1, n2);
    res.json({ num1: n1, num2: n2, operation, result });
  } catch (error) {
    logger.error(`${operation} error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}

app.get('/add', (req, res) => handleOperation(req, res, 'add', (a, b) => a + b));
app.get('/subtract', (req, res) => handleOperation(req, res, 'subtract', (a, b) => a - b));
app.get('/multiply', (req, res) => handleOperation(req, res, 'multiply', (a, b) => a * b));
app.get('/divide', (req, res) => {
  if (parseFloat(req.query.num2) === 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  handleOperation(req, res, 'divide', (a, b) => a / b);
});
app.get('/power', (req, res) => handleOperation(req, res, 'power', (a, b) => Math.pow(a, b)));
app.get('/sqrt', (req, res) => {
  const { num1 } = req.query;
  const n = parseFloat(num1);
  if (isNaN(n)) return res.status(400).json({ error: 'Invalid number' });
  if (n < 0) return res.status(400).json({ error: 'Cannot calculate square root of negative number' });
  res.json({ number: n, operation: 'square root', result: Math.sqrt(n) });
});
app.get('/modulo', (req, res) => {
  if (parseFloat(req.query.num2) === 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  handleOperation(req, res, 'modulo', (a, b) => a % b);
});

// Save result to MongoDB
app.post('/save', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('history').insertOne(req.body);
    console.log('Saved result:', result); // Log the insert result
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    logger.error(`Save error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Fetch history
app.get('/history', async (req, res) => {
  try {
    const records = await mongoose.connection.db.collection('history').find({}).toArray();
    res.json(records);
  } catch (error) {
    logger.error(`History fetch error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
