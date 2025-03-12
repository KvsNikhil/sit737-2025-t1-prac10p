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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


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

// Calculator route
app.get('/calculate', (req, res) => {
    const { num1, num2, operation } = req.query;
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    let result;

    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({ error: 'Invalid numbers' });
    }

    switch (operation) {
        case 'add':
            result = n1 + n2;
            break;
        case 'subtract':
            result = n1 - n2;
            break;
        case 'multiply':
            result = n1 * n2;
            break;
        case 'divide':
            if (n2 === 0) {
                return res.status(400).json({ error: 'Cannot divide by zero' });
            }
            result = n1 / n2;
            break;
        default:
            return res.status(400).json({ error: 'Invalid operation' });
    }

    res.json({ num1: n1, num2: n2, operation, result });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
