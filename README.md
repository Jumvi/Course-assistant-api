# KadeaCoach Canvas OpenAI Bot

## Description

Cette application permet aux étudiants d'interroger OpenAI sur le contenu de leurs cours de développement web fullstack, via une API sécurisée. Chaque étudiant doit s'inscrire et se connecter pour accéder au service, et dispose d'un quota de 10 requêtes par jour. Les réponses d'OpenAI sont strictement basées sur le contexte du programme de formation, indexé et recherché grâce à Typesense.

## Fonctionnalités principales

- Authentification par email et mot de passe (inscription, connexion)
- Limite de 10 requêtes OpenAI par étudiant et par jour
- Interrogation d'OpenAI sur le contenu du cours (avec contexte personnalisé)
- Historique des discussions par utilisateur
- Récupération de tout l'historique (pour les administrateurs)
- Indexation et recherche contextuelle via Typesense (Docker)

## Outils et technologies utilisés

- [AdonisJS](https://adonisjs.com/) (backend Node.js)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Typesense](https://typesense.org/) (moteur de recherche contextuelle, via Docker)
- PostgreSQL (base de données)
- Docker (pour Typesense)

## Commandes de base

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer Typesense (contexte)

Avec Docker Compose (recommandé) :

```bash
docker compose up -d
```

Ou avec npm script (si configuré) :

```bash
npm run typesense
```

Ou directement :

```bash
docker run -d --name=typesense-server -p 8108:8108 -v "$(pwd)/typesense-data:/data" typesense/typesense:0.25.2 \
  --data-dir /data --api-key=xyz --enable-cors
```

### 3. Générer les chunks de contexte (indexation du cours)

```bash
npm run chunck
ou directement
node scripts/index_course_to_typesense.js
```

### 4. Lancer l'application en développement

```bash
npm run dev
```

### 5. Lancer l'application en production

```bash
npm run build
npm run start
```

## Endpoints principaux

- `POST /singUp` : Inscription
- `POST /login` : Connexion
- `POST /openai/chat` : Interroger OpenAI (authentification requise)
- `GET /user/chat/history` : Historique personnel (authentification requise)
- `GET /chat/history` : Historique global (admin uniquement)

## Déploiement en production

1. Installer Docker et Node.js sur le serveur (ex : DigitalOcean)
2. Démarrer Typesense avec Docker (voir plus haut)
3. Générer les chunks de contexte (`node scripts/index_course_to_typesense.js`)
4. Configurer les variables d'environnement (`.env`), notamment la clé OpenAI et la clé Typesense
5. Lancer l'application (`npm run build && npm run start`)
6. Sécuriser l'accès à Typesense (firewall, clé API forte)
7. Mettre en place des sauvegardes régulières du dossier `typesense-data` et de la base PostgreSQL

## Questions fréquentes

- **Comment ajouter ou mettre à jour le contenu du cours ?**
  - Modifie le fichier Markdown dans `docs/`, puis relance le script d'indexation.
- **Comment changer la limite de requêtes par jour ?**
  - Modifie la logique de quota dans le backend (service/historique).
- **Comment voir les logs Typesense ?**
  - Les logs sont dans le dossier `typesense-data/logs` (non versionné par Git).

---

Pour toute question ou contribution, contacte l'équipe KadeaCoach.
