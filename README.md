# 🦉 BEPCMath AI

Tuteur IA de mathématiques pour le BEPC au Burkina Faso.

## 🚀 Lancer le projet

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000 dans ton navigateur.

## 📁 Structure du projet

```
src/
├── App.jsx                    # Composant racine, routing des pages
├── index.css                  # Styles globaux + animations
├── main.jsx                   # Point d'entrée React
│
├── components/
│   ├── Header.jsx/.module.css # Barre supérieure (logo + XP)
│   ├── Nav.jsx/.module.css    # Navigation entre les 3 pages
│   ├── Dashboard.jsx/.module.css  # Tableau de bord
│   ├── SessionPage.jsx/.module.css # Page de révision
│   ├── Sidebar.jsx/.module.css    # Panneau latéral chapitres
│   ├── OwlTutor.jsx/.module.css   # Hibou tuteur (Lottie + SVG fallback)
│   ├── ChatArea.jsx/.module.css   # Zone de chat IA
│   ├── AnnalesPage.jsx/.module.css # Page annales BEPC
│   └── Toast.jsx/.module.css      # Notification toast
│
├── hooks/
│   ├── useXP.js               # Gestion des points XP
│   └── useToast.js            # Affichage des toasts
│
└── data/
    └── chapters.js            # Données chapitres + system prompt IA
```

## 🤖 IA intégrée (Prompt Engineering)

Le tuteur utilise l'API Anthropic Claude avec un **system prompt** spécialisé :

- **Persona** : MathBot, hibou sage, tuteur BEPC Burkina Faso
- **Contexte** : Chapitre actif injecté dynamiquement
- **Mission** : Expliquer, corriger, générer des exercices BEPC
- **Style** : Exemples du quotidien burkinabè (marché, CFA, mil...)
- **Format** : Réponses concises ≤200 mots, français uniquement

### Modifier le prompt
Édite `src/data/chapters.js` → fonction `SYSTEM_PROMPT(chapter)`.

## 🦉 Hibou Lottie

Le composant `OwlTutor` charge une animation Lottie depuis LottieFiles.
Si le réseau échoue, le SVG hibou animé prend le relais automatiquement.

Pour changer l'animation Lottie, modifie le `path` dans `OwlTutor.jsx` :
```js
path: "https://assets5.lottiefiles.com/packages/lf20_VOTRE_ID.json"
```

## 🎨 Design

- **Thème** : Dark mode, palette dorée (#e8a020)
- **Police** : Sora + JetBrains Mono
- **CSS** : CSS Modules par composant
- **Animations** : CSS keyframes + float SVG

## 📦 Technologies

- **React 18** + **Vite 5**
- **CSS Modules** (zéro dépendance CSS-in-JS)
- **lottie-web** pour les animations
- **API Anthropic** (`claude-sonnet-4-20250514`)
