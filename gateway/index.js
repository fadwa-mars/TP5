const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const LIVRE_SERVICE = process.env.LIVRE_SERVICE_URL || 'http://livre-service:3001';
const MEMBRE_SERVICE = process.env.MEMBRE_SERVICE_URL || 'http://membre-service:3002';
const EMPRUNT_SERVICE = process.env.EMPRUNT_SERVICE_URL || 'http://emprunt-service:3003';

// ROUTAGE LIVRES
app.get('/livres', async (req, res) => {
  try {
    const r = await axios.get(`${LIVRE_SERVICE}/livres`);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.get('/livres/:id', async (req, res) => {
  try {
    const r = await axios.get(`${LIVRE_SERVICE}/livres/${req.params.id}`);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.post('/livres', async (req, res) => {
  try {
    const r = await axios.post(`${LIVRE_SERVICE}/livres`, req.body);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.put('/livres/:id', async (req, res) => {
  try {
    const r = await axios.put(`${LIVRE_SERVICE}/livres/${req.params.id}`, req.body);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.patch('/livres/:id/disponibilite', async (req, res) => {
  try {
    const r = await axios.patch(`${LIVRE_SERVICE}/livres/${req.params.id}/disponibilite`, req.body);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.delete('/livres/:id', async (req, res) => {
  try {
    const r = await axios.delete(`${LIVRE_SERVICE}/livres/${req.params.id}`);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

// ROUTAGE MEMBRES
app.get('/membres/:id', async (req, res) => {
  try {
    const r = await axios.get(`${MEMBRE_SERVICE}/membres/${req.params.id}`);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.post('/membres', async (req, res) => {
  try {
    const r = await axios.post(`${MEMBRE_SERVICE}/membres`, req.body);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

// ROUTAGE EMPRUNTS
app.post('/emprunts', async (req, res) => {
  try {
    const r = await axios.post(`${EMPRUNT_SERVICE}/emprunts`, req.body);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.patch('/emprunts/:id/retour', async (req, res) => {
  try {
    const r = await axios.patch(`${EMPRUNT_SERVICE}/emprunts/${req.params.id}/retour`, req.body);
    res.status(r.status).json(r.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => console.log('Gateway active sur le port 3000'));
