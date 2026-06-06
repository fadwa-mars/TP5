# TP5 — Architecture Microservices & API Gateway

Système de gestion de bibliothèque basé sur une architecture microservices conteneurisée avec Docker.

## Architecture

- **livre-service** (port 3001) — gestion des livres
- **membre-service** (port 3002) — gestion des membres  
- **emprunt-service** (port 3003) — gestion des emprunts
- **api-gateway** (port 3000) — point d'entrée unique
- **MongoDB** (port 27017) — base de données

## Lancer le projet

### Prérequis
- Docker Desktop installé et lancé

### Commandes

```bash
git clone https://github.com/TonNom/TP_5.git
cd TP_5
docker compose build
docker compose up -d
```

L'API est accessible sur : `http://localhost:3000`


## Exemple de test (Postman)

**Créer un livre**
```json
POST http://localhost:3000/livres
{
  "titre": "Clean Code",
  "auteur": "Robert Martin",
  "isbn": "978-0132350884"
}
```

**Créer un membre**
```json
POST http://localhost:3000/membres
{
  "nom": "Fadwa",
  "email": "fadwa@mail.com"
}
```

**Créer un emprunt**
```json
POST http://localhost:3000/emprunts
{
  "idMembre": 1,
  "idLivre": 1
}
```