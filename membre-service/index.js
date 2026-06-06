const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());

const url = process.env.MONGO_URL || "mongodb://mongodb:27017/bibliotheque_membres";
const client = new MongoClient(url);
let db;

client.connect().then(() => {
  db = client.db();
  console.log("MongoDB connectée pour Membre Service");
}).catch(err => console.log(err));

app.get('/membres/:id', async (req, res) => {
  try {
    const membre = await db.collection('membres').findOne({ id: parseInt(req.params.id) });
    if (!membre) return res.status(404).json({ message: "Membre non trouvé" });
    res.status(200).json(membre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/membres', async (req, res) => {
  try {
    const counter = await db.collection('membres').find({}).toArray();
    const nextId = counter.length > 0 ? Math.max(...counter.map(m => m.id || 0)) + 1 : 1;
    const newMembre = { id: nextId, ...req.body };
    await db.collection('membres').insertOne(newMembre);
    res.status(201).json(newMembre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3002, () => console.log('Membre service actif sur le port 3002'));
