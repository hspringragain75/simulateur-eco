# 🇫🇷 Et si la France... - Simulateur Économique

Un simulateur économique interactif permettant d'explorer les effets de différentes politiques publiques sur l'économie française.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Objectif

Ce projet vise à rendre accessible la modélisation économique au grand public, aux militant·es syndicaux, aux étudiant·es et aux décideur·ses. Il permet d'explorer de manière interactive et pédagogique les effets économiques de mesures comme :

- 💶 **Augmentation du SMIC** (ex: passage à 15€/h)
- ⏰ **Réduction du temps de travail** (ex: semaine de 32h)
- *(D'autres scénarios seront ajoutés progressivement)*

## ✨ Caractéristiques

### 🔬 Rigueur scientifique
- Modèles basés sur la littérature académique (CAE, OCDE, OFCE)
- Données officielles (INSEE, DARES, Banque de France)
- Sources citées pour chaque paramètre
- Transparence totale sur les hypothèses

### 🎮 Interactivité avancée
- Tous les curseurs visibles et ajustables
- Résultats en temps réel
- Graphiques dynamiques (Recharts)
- Fourchettes d'incertitude

### 📊 Résultats détaillés
Pour chaque scénario, le simulateur calcule :
- Impact sur l'emploi (avec décomposition)
- Effets sur le pouvoir d'achat
- Inflation supplémentaire
- Conséquences pour les finances publiques
- Impact sur les marges des entreprises
- Effets sur le commerce extérieur
- *(Et plus selon le scénario)*

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ et npm

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/cftc/simulateur-economique-france.git
cd simulateur-economique-france

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du projet

```
simulateur-economique-france/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Slider.jsx       # Curseur avec info-bulle
│   │   ├── ResultCard.jsx   # Carte de résultat
│   │   └── ScenarioSelector.jsx
│   ├── simulateurs/         # Simulateurs par scénario
│   │   ├── SimulateurSMIC.jsx
│   │   └── Simulateur32h.jsx
│   ├── data/
│   │   └── modeles.js       # Modèles économiques et sources
│   ├── utils/
│   │   └── calculs.js       # Fonctions de calcul
│   ├── App.jsx              # Application principale
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## 🧮 Méthodologie

### Scénario 1 : SMIC à 15€/h

**Modèle utilisé :**
1. **Impact emploi** : Élasticité emploi/coût du travail
   - Court terme : -0.3 à -0.5 (Cahuc & Carcillo 2012, OCDE 2019)
   - Long terme : -0.7 à -1.0 (Hamermesh 1993)

2. **Transmission aux prix** : 30% à 60%
   - Sources : Biscourp et al. (2005) INSEE, Gautier & Roux (2019) BdF

3. **Effet consommation** : Propension marginale différenciée
   - Bas revenus : 0.9
   - Revenus moyens : 0.7
   - Hauts revenus : 0.4
   - Source : INSEE Enquête Budget Familles 2020

4. **Effet multiplicateur** : 1.1 à 1.5 (OFCE 2020, IMF 2012)

### Scénario 2 : Semaine de 32h

**Modèle utilisé :**
1. **Embauches compensatoires** : 0% à 15%
   - Basé sur l'expérience des 35h (1998-2000)
   - Études DARES

2. **Gains de productivité** : 0% à 10%
   - Méta-analyses (Pencavel 2015, ILO 2018)

3. **Impact emploi dual** :
   - Effet positif : embauches
   - Effet négatif : hausse coût horaire

4. **Bénéfices qualitatifs** :
   - Santé : réduction burn-out, arrêts maladie
   - Environnement : émissions CO2
   - Qualité de vie : temps libre

## ⚠️ Limites et avertissements

**Ce simulateur :**
- ✅ Fournit des ordres de grandeur basés sur des modèles académiques
- ✅ Permet d'explorer différentes hypothèses de manière transparente
- ✅ Affiche des fourchettes reflétant l'incertitude

**Mais il ne peut pas :**
- ❌ Prédire avec certitude les effets réels d'une mesure
- ❌ Capturer toute la complexité de l'économie
- ❌ Anticiper les réactions stratégiques de tous les agents
- ❌ Intégrer le contexte international en détail

**Les résultats dépendent fortement :**
- Des modalités concrètes de mise en œuvre
- Du contexte économique
- Des mesures d'accompagnement
- Des réactions comportementales

## 🔮 Scénarios à venir

Scénarios en cours de développement :
- 🏦 Taxation des superprofits
- 🎓 Retraite à 60 ans
- 💰 Revenu universel
- 🏭 Relocalisation industrielle
- 🌱 Transition écologique accélérée

## 🤝 Contributions

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

**Nous recherchons particulièrement :**
- 📊 Améliorations des modèles économiques
- 🔬 Nouvelles sources académiques
- 🎨 Améliorations UX/UI
- 🌍 Traductions
- 📝 Documentation

## 📚 Références principales

### Données économiques
- INSEE - Comptes nationaux, Enquêtes emploi
- DARES - Portrait statistique des salariés, études RTT
- Banque de France - Études sectorielles
- URSSAF - Cotisations sociales

### Études académiques
- Cahuc P. & Carcillo S. (2012) - Les conséquences des allégements de cotisations, CAE
- Crépon B. & Desplatz R. (2001) - Évaluation des allégements de charges, INSEE
- Hamermesh D. (1993) - Labor Demand, Princeton University Press
- OCDE (2019) - Employment Outlook
- OFCE (2020) - Les multiplicateurs budgétaires en France
- Pencavel J. (2015) - The Productivity of Working Hours, IZA
- Biscourp et al. (2005) - Les salaires sont-ils rigides ?, INSEE

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails

## 👥 Auteurs

Développé par la **CFTC** (Confédération Française des Travailleurs Chrétiens)

## 📧 Contact

Pour toute question, suggestion ou bug :
- 📧 Email : simulateur@cftc.fr
- 🐛 Issues : [GitHub Issues](https://github.com/cftc/simulateur-economique-france/issues)
- 💬 Discussions : [GitHub Discussions](https://github.com/cftc/simulateur-economique-france/discussions)

---

**⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile sur GitHub !**
