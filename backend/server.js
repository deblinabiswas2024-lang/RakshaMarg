// server.js - RakshaMarg Central Mailbox
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

let distressAlerts = [];

// Health check endpoint
app.get('/', (req, res) => {
  res.send('🛡️ RakshaMarg Server is live and listening on port 3000.');
});

// Receive SOS distress packet from the traveler app
app.post('/api/sos', (req, res) => {
  const incomingPacket = req.body;
  const alertRecord = {
    id: 'ALERT-' + Date.now(),
    receivedAt: new Date().toISOString(),
    ...incomingPacket
  };
  distressAlerts.push(alertRecord);
  console.log('🚨 NEW EMERGENCY RECEIVED:', alertRecord);
  res.status(201).json({ message: 'Distress packet logged successfully.', record: alertRecord });
});

// Provide all recorded alerts to the dashboard
app.get('/api/alerts', (req, res) => {
  res.json(distressAlerts);
});

app.listen(PORT, () => {
  console.log(`✅ RakshaMarg server running at http://localhost:${PORT}`);
});