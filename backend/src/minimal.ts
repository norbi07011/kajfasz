import express from 'express';

const app = express();
const PORT = 9999;

console.log('🚀 Starting minimal server...');

app.get('/test', (req, res) => {
  console.log('📥 Test request received');
  res.json({ status: 'working', time: new Date().toISOString() });
  console.log('✅ Test response sent');
});

app.listen(PORT, () => {
  console.log(`✅ Minimal server running on http://localhost:${PORT}`);
  console.log('📋 Test endpoint: http://localhost:9999/test');
});

export {};