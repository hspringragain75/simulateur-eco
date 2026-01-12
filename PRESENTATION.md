# 🇫🇷 ET SI LA FRANCE... - Simulateur Économique CFTC

## 📖 Présentation du projet

### Vision
Un outil pédagogique et interactif permettant à chacun·e d'explorer les conséquences économiques de grandes mesures de politique publique, basé sur des modèles académiques rigoureux.

### Philosophie
- **Transparence** : Chaque hypothèse est sourcée et documentée
- **Pédagogie** : Rendre l'économie accessible sans simplification excessive
- **Rigueur** : S'appuyer sur la recherche académique et les données officielles
- **Honnêteté** : Afficher l'incertitude via des fourchettes

## 🎯 Objectifs

### Pour le grand public
- Comprendre les mécanismes économiques complexes
- Visualiser les arbitrages inhérents aux politiques publiques
- Dépasser les discours simplistes ("ça marchera" vs "c'est catastrophique")

### Pour les militant·es syndicaux
- Disposer d'arguments chiffrés lors des négociations
- Anticiper les contre-arguments patronaux
- Proposer des scénarios alternatifs crédibles

### Pour les étudiant·es et enseignant·es
- Outil pédagogique pour les cours d'économie
- Illustration concrète des concepts macro (élasticité, multiplicateur, etc.)
- Support pour débats et études de cas

## 📊 Scénarios disponibles (v1.0)

### 1. SMIC à 15€/h 💶
**Question :** Et si la France portait le SMIC de 11,88€ à 15€/h ?

**Paramètres ajustables :**
- Niveau du nouveau SMIC (11,88€ à 20€/h)
- Élasticité emploi/coût du travail
- Transmission aux prix (inflation)
- Propension à consommer des bas revenus
- Diffusion aux salaires supérieurs
- Horizon temporel (1, 3, 5 ans)

**Résultats calculés :**
- Impact sur l'emploi (avec fourchette d'incertitude)
- Gain de pouvoir d'achat par niveau de revenu
- Inflation supplémentaire
- Solde des finances publiques (détaillé)
- Impact sur les marges des entreprises
- Effet sur le commerce extérieur
- Evolution temporelle sur graphique

**Sources principales :**
- Cahuc & Carcillo (2012) - CAE
- OCDE (2019) - Employment Outlook
- INSEE - Comptes nationaux 2023-2024
- DARES - Portrait statistique 2023

### 2. Semaine de 32h ⏰
**Question :** Et si la France passait de 35h à 32h hebdomadaires ?

**Paramètres ajustables :**
- Nombre d'heures (30h à 35h)
- Pourcentage de maintien du salaire
- Taux d'embauches compensatoires
- Gains de productivité horaire
- Élasticité emploi/coût horaire
- Transmission aux prix
- Horizon temporel (1, 3, 5, 10 ans)

**Résultats calculés :**
- Emplois créés vs détruits (effet dual)
- Nouveau taux de chômage
- Temps libéré (heures et jours/an)
- Pouvoir d'achat réel
- Coût pour les entreprises (détaillé)
- Finances publiques
- Bénéfices qualitatifs (santé, environnement)

**Sources principales :**
- DARES - Études sur les 35h
- Pencavel (2015) - Productivity of Working Hours
- ILO (2018) - Working time reports
- Études scandinaves sur réduction temps travail

## 🔬 Rigueur méthodologique

### Modèles économiques
Chaque scénario s'appuie sur :
- **Élasticités** validées par la littérature académique
- **Données officielles** (INSEE, DARES, BdF, URSSAF)
- **Effets de second ordre** : boucles prix-salaires, multiplicateurs
- **Décomposition détaillée** des impacts

### Gestion de l'incertitude
- **Fourchettes** pour tous les résultats principaux
- **Paramètres ajustables** pour tester différentes hypothèses
- **Avertissements explicites** sur les limites
- **Scénarios prédéfinis** : optimiste, consensus, pessimiste

### Transparence
- Code source ouvert (MIT license)
- Sources citées pour chaque paramètre
- Formules de calcul accessibles
- Documentation méthodologique complète

## 💻 Stack technique

### Frontend
- **React 18** : Framework UI
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Styling
- **Recharts** : Visualisations interactives
- **Lucide React** : Icônes

### Hébergement
- **GitHub Pages** : Gratuit, rapide, fiable
- **Déploiement automatique** : via GitHub Actions
- **CDN global** : Temps de chargement optimaux

### Développement
- Développement local en live-reload
- Build optimisé pour production
- Responsive design (mobile/tablet/desktop)

## 📈 Évolutions futures

### Scénarios en préparation
- 🏦 **Taxation des superprofits** : Quel taux ? Quel rendement ?
- 💰 **Revenu universel** : 500€, 800€, 1000€/mois ?
- 🎓 **Retraite à 60 ans** : Coût et financement
- 🏭 **Relocalisation industrielle** : Effets emploi/PIB
- 🌱 **Transition écologique accélérée** : Investissements vs emplois

### Fonctionnalités envisagées
- 📱 **Mode comparaison** : Comparer 2 scénarios côte à côte
- 💾 **Sauvegarde** : Enregistrer ses simulations
- 📊 **Export** : PDF, images des graphiques
- 🔗 **Partage** : URL avec paramètres pré-configurés
- 🌍 **Multi-pays** : Adapter à d'autres économies
- 📚 **Mode "quiz"** : Deviner les résultats avant de les révéler

### Améliorations techniques
- Mode sombre
- Traduction (EN, ES, DE)
- Accessibilité (WCAG 2.1)
- Progressive Web App
- API REST pour intégration externe

## 🤝 Comment contribuer

### Types de contributions recherchées

1. **Améliorations économiques** 🔬
   - Nouvelles sources académiques
   - Validation des modèles par des économistes
   - Suggestions de nouveaux paramètres
   - Critique constructive des hypothèses

2. **Nouveaux scénarios** 📊
   - Proposer de nouvelles mesures à simuler
   - Identifier les sources pertinentes
   - Définir les paramètres clés

3. **Améliorations techniques** 💻
   - Optimisations de performance
   - Nouveaux composants UI
   - Tests automatisés
   - Documentation

4. **UX/UI** 🎨
   - Design de nouveaux composants
   - Amélioration de l'ergonomie
   - Accessibilité
   - Responsive design

5. **Communication** 📢
   - Traductions
   - Documentation pédagogique
   - Vidéos explicatives
   - Études de cas

### Process de contribution
1. **Fork** le projet
2. **Créer une branche** pour votre contribution
3. **Documenter** votre travail (code commenté, README)
4. **Tester** que tout fonctionne
5. **Pull Request** avec description claire

## 📊 Chiffres clés

### Complexité du modèle
- **2 scénarios** implémentés (v1.0)
- **13 curseurs ajustables** au total
- **20+ indicateurs** calculés
- **100+ sources académiques** potentielles
- **Fourchettes d'incertitude** sur tous les résultats clés

### Code
- **~2000 lignes** de code React/JS
- **6 composants réutilisables**
- **2 simulateurs complets**
- **100% responsive**
- **0 dépendances lourdes**

## 🎓 Cas d'usage

### En réunion syndicale
*"Regardez, avec nos revendications de SMIC à 15€, on peut montrer que même dans le scénario pessimiste, le gain de pouvoir d'achat reste significatif."*

### En formation militante
*"Utilisez le simulateur pour comprendre comment les paramètres interagissent. Testez différentes hypothèses."*

### En cours d'économie
*"Aujourd'hui, nous allons utiliser le simulateur pour illustrer concrètement les concepts d'élasticité et de multiplicateur keynésien."*

### En débat public
*"Plutôt que des affirmations gratuites, regardons ensemble ce que disent les modèles économiques basés sur des données réelles."*

### En négociation NAO
*"Voici une simulation rigoureuse montrant les effets d'une revalorisation. Nous pouvons ajuster les paramètres ensemble."*

## ⚖️ Positionnement

### Ce que ce projet EST
✅ Un outil pédagogique rigoureux
✅ Un support de débat informé
✅ Une base pour l'argumentation syndicale
✅ Un projet open source collaboratif

### Ce que ce projet N'EST PAS
❌ Une boule de cristal
❌ Un modèle de prévision exact
❌ Un outil de propagande
❌ Une simplification caricaturale

## 📞 Contact et support

### Communauté
- **GitHub** : Issues et Discussions
- **Email** : simulateur@cftc.fr (fictif pour cet exemple)
- **Documentation** : README.md complet

### Support
- **FAQ** : Dans le README
- **Guide démarrage** : DEMARRAGE.md
- **Exemples** : SCENARIOS.md
- **Code commenté** : Dans le projet

## 📜 Licence

**MIT License** - Utilisation libre, y compris commerciale, avec attribution.

Vous êtes libre de :
- ✅ Utiliser le projet
- ✅ Modifier le code
- ✅ Distribuer vos versions
- ✅ Utiliser commercialement

Obligations :
- 📝 Conserver la notice de copyright
- 📝 Mentionner les modifications

## 🙏 Remerciements

Ce projet s'appuie sur le travail de nombreux chercheurs, institutions et contributeurs open source.

### Institutions
- INSEE, DARES, Banque de France
- OCDE, IMF, ILO
- Conseil d'Analyse Économique (CAE)
- OFCE, IPP

### Chercheurs
- Pierre Cahuc, Stéphane Carcillo
- David Hamermesh
- Bruno Crépon
- Et de nombreux autres économistes

### Communauté open source
- React, Vite, Tailwind CSS, Recharts
- Tous les contributeurs potentiels

---

**🌟 Un projet au service du débat économique éclairé**

*Développé avec ❤️ par et pour les travailleur·ses*
