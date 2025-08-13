// server.js
const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
app.use(cors());
app.use(express.json());

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

app.post('/device/:name', (req, res) => {
  const { name } = req.params; // fan, light, ac
  const { state } = req.body;  // "ON" or "OFF"

  // Publish to topic with /state suffix
  mqttClient.publish(`home/${name}/state`, state);

  console.log(`Sent ${state} to ${name} (topic: home/${name}/state)`);
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));
