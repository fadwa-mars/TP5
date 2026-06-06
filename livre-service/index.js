const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());

const url = process.env.MONGO_URL || "mongodb://mongodb:27017/bibliotheque_livres";
const client = new MongoClient(url);
let db;

client.connect().then(() => {
  db = client.db();
  console.log("MongoDB connectée pour Livre Service");
}).catch(err => console.log(err));

app.get('/livres', async (req, res) => {
  try {
    const livres = await db.collection('livres').find({}).toArray();
    res.status(200).json(livres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/livres/:id', async (req, res) => {
  try {
    const livre = await db.collection('livres').findOne({ id: parseInt(req.params.id) });
    if (!livre) return res.status(404).json({ message: "Livre non trouvé" });
    res.status(200).json(livre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/livres', async (req, res) => {
  try {
    const counter = await db.collection('livres').find({}).toArray();
    const nextId = counter.length > 0 ? Math.max(...counter.map(l => l.id || 0)) + 1 : 1;
    const newLivre = { id: nextId, ...req.body, disponible: true };
    await db.collection('livres').insertOne(newLivre);
    res.status(201).json(newLivre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/livres/:id', async (req, res) => {
  try {
    await db.collection('livres').updateOne({ id: parseInt(req.params.id) }, { $set: req.body });
    res.status(200).json({ message: "Livre mis à jour" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/livres/:id/disponibilite', async (req, res) => {
  try {
    const { disponible } = req.body;
    await db.collection('livres').updateOne({ id: parseInt(req.params.id) }, { $set: { disponible } });
    res.status(200).json({ message: "Disponibilité modifiée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/livres/:id', async (req, res) => {
  try {
    await db.collection('livres').deleteOne({ id: parseInt(req.params.id) });
    res.status(200).json({ message: "Livre supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3001, () => console.log('Livre service actif sur le port 3001'));
