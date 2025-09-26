import express from 'express';
const app = express();

const PORT = 9999;

app.get('/test', (req, res) => {
  res.json({ message: 'Test works!' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
});