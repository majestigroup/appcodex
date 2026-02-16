const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const mockStocks = {
  AAPL: {
    price: 193.24,
    summary: 'Apple saw steady gains after strong hardware sales and services growth.',
    history: [182.11, 184.03, 186.9, 188.45, 190.2, 191.65, 193.24]
  },
  TSLA: {
    price: 224.18,
    summary: 'Tesla remains volatile amid delivery updates and EV market competition.',
    history: [210.45, 214.27, 219.8, 216.35, 221.9, 223.1, 224.18]
  },
  MSFT: {
    price: 417.82,
    summary: 'Microsoft climbed on cloud momentum and AI platform adoption.',
    history: [402.44, 405.2, 407.11, 410.93, 413.6, 415.7, 417.82]
  }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/stock/:symbol', (req, res) => {
  const symbol = String(req.params.symbol || '').toUpperCase();
  const stock = mockStocks[symbol];

  if (!stock) {
    return res.status(404).json({
      error: 'Symbol not found in mock dataset',
      symbol
    });
  }

  return res.json({
    symbol,
    ...stock
  });
});

app.get('/about', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>About This App</title>
  </head>
  <body>
    <h1>About This App</h1>
    <p>This is a test update from Codex to verify GitHub + Replit workflow.</p>
  </body>
</html>`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
