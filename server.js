//Kotapati Venkat Sai Nikhil
//server.js

const express = require('express');
const winston = require('winston');

// Create a Winston logger
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

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Middleware to log request details
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

// Route to serve the frontend
app.get('/', (req, res) => {
    try {
        res.sendFile(__dirname + '/public/index.html');
    } catch (error) {
        logger.error(`Error serving index.html: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Addition endpoint
app.get('/add', (req, res) => {
    try {
        const { num1, num2 } = req.query;
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);

        if (isNaN(n1) || isNaN(n2)) {
            throw new Error('Invalid numbers');
        }

        const result = n1 + n2;
        res.json({ num1: n1, num2: n2, operation: 'add', result });
    } catch (error) {
        logger.error(`Addition error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

// Subtraction endpoint
app.get('/subtract', (req, res) => {
    try {
        const { num1, num2 } = req.query;
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);

        if (isNaN(n1) || isNaN(n2)) {
            throw new Error('Invalid numbers');
        }

        const result = n1 - n2;
        res.json({ num1: n1, num2: n2, operation: 'subtract', result });
    } catch (error) {
        logger.error(`Subtraction error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

// Multiplication endpoint
app.get('/multiply', (req, res) => {
    try {
        const { num1, num2 } = req.query;
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);

        if (isNaN(n1) || isNaN(n2)) {
            throw new Error('Invalid numbers');
        }

        const result = n1 * n2;
        res.json({ num1: n1, num2: n2, operation: 'multiply', result });
    } catch (error) {
        logger.error(`Multiplication error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

// Division endpoint
app.get('/divide', (req, res) => {
    try {
        const { num1, num2 } = req.query;
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);

        if (isNaN(n1) || isNaN(n2)) {
            throw new Error('Invalid numbers');
        }

        if (n2 === 0) {
            throw new Error('Cannot divide by zero');
        }

        const result = n1 / n2;
        res.json({ num1: n1, num2: n2, operation: 'divide', result });
    } catch (error) {
        logger.error(`Division error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
