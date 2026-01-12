# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## Démarrage en 3 étapes

### 1️⃣ Installation des dépendances
```bash
cd simulateur-economique-france
npm install
```

### 2️⃣ Lancement en mode développement
```bash
npm run dev
```

### 3️⃣ Ouvrir dans le navigateur
Ouvrez http://localhost:5173 dans votre navigateur

## 🎮 Utilisation

1. **Choisissez un scénario** : SMIC à 15€/h ou Semaine de 32h
2. **Ajustez les curseurs** selon vos hypothèses
3. **Observez les résultats** en temps réel

## 📊 Que fait chaque curseur ?

### SMIC à 15€/h
- **SMIC horaire brut** : Le nouveau montant du SMIC
- **Élasticité emploi** : Sensibilité de l'emploi au coût du travail (-0.5 = hausse 10% coût → -5% emplois)
- **Transmission prix** : Part de la hausse répercutée sur les prix (0.45 = 45%)
- **Propension consommer** : Part du revenu supplémentaire consommée (0.85 = 85% consommé)
- **Diffusion salaires** : Effet d'entraînement sur les salaires > SMIC
- **Horizon temporel** : Période de projection (1, 3 ou 5 ans)

### Semaine de 32h
- **Heures hebdo** : Nouvelle durée de travail (30 à 35h)
- **Maintien salaire** : Pourcentage du salaire maintenu (100% = aucune baisse)
- **Embauches** : Taux de compensation par des embauches (8% par défaut)
- **Gain productivité** : Amélioration productivité horaire (3% par défaut)
- **Élasticité emploi** : Sensibilité emploi au coût horaire
- **Transmission prix** : Répercussion sur les prix
- **Horizon temporel** : Période (1, 3, 5 ou 10 ans)

## 🎯 Résultats affichés

Pour chaque scénario, vous verrez :
- ✅ Impact sur l'emploi (créations/destructions)
- ✅ Effets pouvoir d'achat
- ✅ Inflation supplémentaire
- ✅ Conséquences finances publiques
- ✅ Impact marges entreprises
- ✅ Graphiques d'évolution temporelle

## 💡 Conseils d'utilisation

### Mode "réaliste" (consensus académique)
Utilisez les valeurs par défaut - elles reflètent le consensus de la littérature économique.

### Mode "optimiste"
- Élasticité emploi : vers -0.3 (effet emploi faible)
- Transmission prix : vers 0.3 (faible inflation)
- Propension consommer : vers 0.9 (forte relance)
- Gains productivité (32h) : vers 0.1 (10%)

### Mode "pessimiste"
- Élasticité emploi : vers -1.0 (effet emploi fort)
- Transmission prix : vers 0.7 (forte inflation)
- Propension consommer : vers 0.7 (faible relance)
- Gains productivité (32h) : vers 0 (aucun gain)

## 📱 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans `/dist`

## 🌐 Déploiement sur GitHub Pages

1. Push vers GitHub
2. Activez GitHub Pages dans les settings (source: GitHub Actions)
3. Le workflow `.github/workflows/deploy.yml` se charge du déploiement automatique

## 🐛 En cas de problème

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur au build
Vérifiez que vous utilisez Node.js 18+
```bash
node --version
```

### Le site ne s'affiche pas correctement
Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

## 📚 Ressources

- **Documentation React** : https://react.dev
- **Recharts** : https://recharts.org
- **Tailwind CSS** : https://tailwindcss.com
- **Vite** : https://vitejs.dev

## 🤝 Besoin d'aide ?

- 📖 Lisez le README.md complet
- 🐛 Ouvrez une issue sur GitHub
- 💬 Consultez les GitHub Discussions

---

**Bon développement ! 🚀**
