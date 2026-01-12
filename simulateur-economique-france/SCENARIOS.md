# 📋 SCÉNARIOS PRÉDÉFINIS

Ce document présente des configurations prédéfinies pour explorer rapidement différentes hypothèses.

## 💶 SMIC à 15€/h

### 🟢 Scénario "Optimiste"
**Hypothèses :**
- SMIC : 15€/h
- Élasticité emploi : -0.3 (faible impact négatif)
- Transmission prix : 30% (faible inflation)
- Propension consommer : 90% (forte relance)
- Diffusion salaires : 30% (effet d'entraînement fort)
- Horizon : 3 ans

**Résultats attendus :**
- Pertes emploi limitées (~150k)
- Gain pouvoir d'achat : +10-12%
- Inflation faible : +0.8%
- Finances publiques : légèrement positives

### 🟡 Scénario "Consensus académique" (par défaut)
**Hypothèses :**
- SMIC : 15€/h
- Élasticité emploi : -0.5 (consensus)
- Transmission prix : 45% (modérée)
- Propension consommer : 85%
- Diffusion salaires : 20%
- Horizon : 3 ans

**Résultats attendus :**
- Pertes emploi : ~250-300k
- Gain pouvoir d'achat : +8-10%
- Inflation : +1.2-1.5%
- Finances publiques : neutre à légèrement positif

### 🔴 Scénario "Pessimiste"
**Hypothèses :**
- SMIC : 15€/h
- Élasticité emploi : -0.8 (fort impact négatif)
- Transmission prix : 60% (forte inflation)
- Propension consommer : 75%
- Diffusion salaires : 10%
- Horizon : 3 ans

**Résultats attendus :**
- Pertes emploi importantes : ~400-500k
- Gain pouvoir d'achat réduit : +5-6%
- Inflation élevée : +2%
- Finances publiques : négatives

### 💙 Scénario "CFTC"
**Hypothèses :**
- SMIC : 15€/h
- Élasticité emploi : -0.4 (modérée)
- Transmission prix : 40%
- Propension consommer : 85%
- Diffusion salaires : 25% (tirer tout le monde vers le haut)
- Horizon : 5 ans

**Justification :**
- Prise en compte de mesures d'accompagnement (allègements ciblés)
- Effet diffusion important pour réduire les inégalités
- Horizon long terme pour absorber le choc

## ⏰ Semaine de 32h

### 🟢 Scénario "Optimiste"
**Hypothèses :**
- Heures : 32h/semaine
- Maintien salaire : 100%
- Embauches : 12% (fort taux de compensation)
- Gain productivité : 8% (salariés reposés = plus efficaces)
- Élasticité emploi : -0.5
- Transmission prix : 40%
- Horizon : 5 ans

**Résultats attendus :**
- Emplois nets créés : +100-200k
- Pouvoir d'achat maintenu
- Temps libéré : 30 jours/an
- Bénéfices santé et environnement significatifs

### 🟡 Scénario "Réaliste" (par défaut)
**Hypothèses :**
- Heures : 32h/semaine
- Maintien salaire : 100%
- Embauches : 8% (basé sur expérience 35h)
- Gain productivité : 3%
- Élasticité emploi : -0.7
- Transmission prix : 55%
- Horizon : 5 ans

**Résultats attendus :**
- Emplois nets : légèrement négatif à neutre
- Pouvoir d'achat : maintien nominal, légère érosion par inflation
- Temps libéré : 30 jours/an
- Coût entreprises significatif

### 🔴 Scénario "Pessimiste"
**Hypothèses :**
- Heures : 32h/semaine
- Maintien salaire : 100%
- Embauches : 4% (faible compensation)
- Gain productivité : 0%
- Élasticité emploi : -1.0
- Transmission prix : 70%
- Horizon : 3 ans

**Résultats attendus :**
- Pertes emploi : -200-300k
- Pouvoir d'achat : baisse réelle
- Inflation élevée
- Coût entreprises très élevé

### 💚 Scénario "Progressif"
**Hypothèses :**
- Heures : 33h/semaine (étape 1, puis 32h)
- Maintien salaire : 95% (compromis)
- Embauches : 10%
- Gain productivité : 5%
- Élasticité emploi : -0.6
- Transmission prix : 45%
- Horizon : 10 ans

**Justification :**
- Mise en œuvre progressive pour lisser les effets
- Maintien salaire partiel = compromis viable
- Horizon long pour adaptation progressive

## 🔬 Scénarios de sensibilité

### Test : Impact de l'élasticité emploi
**Configuration :**
Garder tous les paramètres constants sauf élasticité, tester :
- -0.3, -0.5, -0.7, -1.0

**Objectif :** Voir l'ampleur de l'incertitude sur l'emploi

### Test : Impact de la transmission aux prix
**Configuration :**
Garder tous les paramètres constants sauf transmission, tester :
- 30%, 45%, 60%

**Objectif :** Voir l'impact sur l'inflation et le pouvoir d'achat réel

### Test : Importance des gains de productivité (32h)
**Configuration :**
Pour le scénario 32h, tester gains productivité :
- 0%, 3%, 6%, 10%

**Objectif :** Évaluer le potentiel compensatoire de la productivité

## 📊 Comment interpréter les résultats

### Fourchettes
Les fourchettes affichées représentent l'incertitude du modèle. Une fourchette large signale une forte incertitude.

### Ordres de grandeur
Les résultats doivent être interprétés comme des ordres de grandeur, pas comme des prévisions exactes.

### Effets de long terme
Les effets évoluent dans le temps. Un horizon de 5-10 ans permet de voir les ajustements progressifs.

### Combinaison de politiques
Dans la réalité, ces mesures seraient accompagnées d'autres politiques (allègements, aides, etc.) qui modifient les résultats.

## 🎯 Recommandations d'utilisation

1. **Commencez par le scénario par défaut** pour comprendre le consensus académique
2. **Testez les scénarios optimiste et pessimiste** pour voir l'étendue du possible
3. **Ajustez un curseur à la fois** pour comprendre son impact spécifique
4. **Comparez différents horizons temporels** pour voir l'évolution
5. **Notez vos hypothèses** pour pouvoir reproduire vos simulations

## 💡 Idées de questions à explorer

- Quel niveau de SMIC pour maximiser le pouvoir d'achat réel ?
- À partir de quel taux d'embauches le passage à 32h devient-il neutre pour l'emploi ?
- Quel est l'effet d'une réduction plus modeste (33h ou 34h) ?
- Comment varie l'impact selon l'horizon temporel ?
- Quelle combinaison de paramètres minimise l'inflation ?

---

**Amusez-vous à explorer ! 🚀**
