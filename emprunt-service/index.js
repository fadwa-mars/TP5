const express = require("express");
const { MongoClient } = require("mongodb");
const axios = require("axios");
const app = express();
app.use(express.json());

const url = process.env.MONGO_URL || "mongodb://mongodb:27017/bibliotheque_emprunts";
const LIVRE_SERVICE = process.env.LIVRE_SERVICE_URL || 'http://livre-service:3001';
const MEMBRE_SERVICE = process.env.MEMBRE_SERVICE_URL || 'http://membre-service:3002';

const client = new MongoClient(url);
let db;

client.connect().then(() => {
  db = client.db();
  console.log("MongoDB connectée pour Emprunt Service");
}).catch(err => console.log(err));

app.post('/emprunts', async (req, res) => {
  try {
    const { idLivre, idMembre } = req.body;

    const livreRes = await axios.get(`${LIVRE_SERVICE}/livres/${idLivre}`);
    if (!livreRes.data.disponible) {
      return res.status(400).json({ message: "Le livre demandé n'est pas disponible" });
    }

    await axios.get(`${MEMBRE_SERVICE}/membres/${idMembre}`);

    const counter = await db.collection('emprunts').find({}).toArray();
    const nextId = counter.length > 0 ? Math.max(...counter.map(e => e.id || 0)) + 1 : 1;
    const newEmprunt = { id: nextId, idLivre, idMembre, retourne: false, dateEmprunt: new Date() };
    await db.collection('emprunts').insertOne(newEmprunt);

    await axios.patch(`${LIVRE_SERVICE}/livres/${idLivre}/disponibilite`, { disponible: false });

    res.status(201).json(newEmprunt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/emprunts/:id/retour', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { retourne } = req.body;

    const emprunt = await db.collection('emprunts').findOne({ id: id });
    if (!emprunt) {
      return res.status(404).json({ message: "Emprunt non trouvé" });
    }

    await db.collection('emprunts').updateOne(
      { id: id },
      { $set: { retourne } }
    );

    await axios.patch(
      `${LIVRE_SERVICE}/livres/${emprunt.idLivre}/disponibilite`,
      { disponible: true }
    );

    res.status(200).json({ message: "Livre retourné avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(3003, () => console.log('Emprunt service actif sur le port 3003'));
