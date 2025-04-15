const express = require('express');
const winston = require('winston');
const cors = require('cors');

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

// Enable CORS
app.use(cors());

//app.use(express.static('public'));

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
        //res.sendFile(__dirname + '/public/index.html');
        res.send('Updated Kubernetes Calculator Application');
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

// Exponentiation endpoint (Power)
app.get('/power', (req, res) => {
    try {
        const { num1, num2 } = req.query;
        const base = parseFloat(num1);
        const exponent = parseFloat(num2);

        if (isNaN(base) || isNaN(exponent)) {
            throw new Error('Invalid numbers provided');
        }

        const result = Math.pow(base, exponent);
        res.json({
            base,
            exponent,
            operation: 'power',
            result
        });
    } catch (error) {
        logger.error(`Exponentiation error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

// Square root endpoint
app.get('/sqrt', (req, res) => {
    try {
        const { num1 } = req.query;
        const number = parseFloat(num1);

        if (isNaN(number)) {
            throw new Error('Invalid number provided');
        }

        if (number < 0) {
            throw new Error('Cannot calculate the square root of a negative number');
        }

        const result = Math.sqrt(number);
        res.json({
            number,
            operation: 'square root',
            result
        });
    } catch (error) {
        logger.error(`Square root error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

// Modulo operation endpoint
app.get('/modulo', (req, res) => {
    try {
        const { num1, num2 } = req.query;
        const dividend = parseFloat(num1);
        const divisor = parseFloat(num2);

        if (isNaN(dividend) || isNaN(divisor)) {
            throw new Error('Invalid numbers provided');
        }
        if (divisor === 0) {
            throw new Error('Cannot divide by zero');
        }
        const result = dividend % divisor;
        res.json({
            dividend,
            divisor,
            operation: 'modulo',
            result
        });
    } catch (error) {
        logger.error(`Modulo error: ${error.message}`);
        res.status(400).json({ error: error.message });
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

