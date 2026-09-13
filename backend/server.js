const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory store for evaluation demo
let distressAlerts = [];

// 1. Dynamic Hazard Zones Endpoint (SIH Requirement 4)
app.get('/api/hazard-zones', (req, res) => {
  res.json([
    {
      id: 'NH29-KOHIMA-01',
      name: 'NH-29 Kohima Risk Corridor',
      center: [25.6848, 94.1112],
      highRiskRadius: 2000,
      moderateRiskRadius: 4000,
      severity: 'HIGH',
      telemetry: {
        rainfall48h: 138.4,
        slopeTiltRate: '+3.8 deg/hr',
        aiSusceptibilityIndex: 0.84
      }
    }
  ]);
});

// 2. SOS Alert Ingestion
app.post('/api/sos', (req, res) => {
  const packet = req.body;
  
  if (!packet.travelerId || !packet.location) {
    return res.status(400).json({ error: 'Incomplete SOS payload' });
  }

  distressAlerts.unshift(packet);

  // Authority Dispatch Log (SIH Requirement 6 & 9)
  console.log(`[DISASTER DISPATCH] 🚨 SOS received from ${packet.travelerId}`);
  console.log(` -> Coordinates: [${packet.location.latitude}, ${packet.location.longitude}]`);
  console.log(` -> Risk Severity: ${packet.geoFenceMetadata?.zoneSeverity || 'UNKNOWN'}`);

  res.status(201).json({
    message: 'Distress packet confirmed and relayed to Disaster Response Centre',
    alertId: 'ALT-' + Date.now()
  });
});

// 3. Endpoint for Authority Monitoring Dashboard
app.get('/api/sos', (req, res) => {
  res.json(distressAlerts);
});

app.listen(PORT, () => {
  console.log(`RakshaMarg Core Engine running on port ${PORT}`);
});