# 🔧 NOTES TECHNIQUES POUR CONTRIBUTEURS

## Architecture du projet

### Structure des dossiers
```
src/
├── components/          # Composants réutilisables
│   ├── Slider.jsx       # Curseur avec tooltip
│   ├── ResultCard.jsx   # Carte de résultat avec tendance
│   └── ScenarioSelector.jsx
├── simulateurs/         # Un fichier par scénario
│   ├── SimulateurSMIC.jsx
│   └── Simulateur32h.jsx
├── data/
│   └── modeles.js       # Données, sources, scenarios
├── utils/
│   └── calculs.js       # Fonctions de calcul économique
├── App.jsx              # App principale
├── main.jsx             # Point d'entrée
└── index.css            # Styles globaux
```

### Flux de données

```
App.jsx
  ↓
ScenarioSelector → change scenario
  ↓
SimulateurXXX.jsx
  ↓
├── useState(params) → État local des curseurs
├── useMemo(calculs) → Recalcul à chaque changement
└── Components (Slider, ResultCard, Charts)
```

## 🎨 Créer un nouveau scénario

### Étape 1 : Définir le modèle économique

Dans `src/data/modeles.js`, ajouter :

```javascript
export const SCENARIOS = {
  // ... scénarios existants
  
  nouveauScenario: {
    nom: "Mon nouveau scénario",
    description: "Description courte",
    curseurs: {
      parametre1: {
        min: 0,
        max: 100,
        default: 50,
        step: 1,
        unite: "%",
        label: "Label affiché",
        info: "Tooltip explicatif avec sources"
      },
      // ... autres paramètres
    }
  }
};
```

### Étape 2 : Créer la fonction de calcul

Dans `src/utils/calculs.js` :

```javascript
export function calculerImpactNouveauScenario(params) {
  const { parametre1, parametre2, ... } = params;
  
  // 1. Calculs intermédiaires avec commentaires
  const resultatIntermediaire = DONNEES_BASE.xxx * parametre1;
  
  // 2. Utiliser les FORMULES définies
  const impactEmploi = FORMULES.impactEmploi(...);
  
  // 3. Retourner un objet structuré
  return {
    emploi: {
      absolu: ...,
      pourcent: ...,
      fourchette: { min: ..., max: ... }
    },
    autreIndicateur: {
      // ...
    }
  };
}
```

### Étape 3 : Créer le composant simulateur

Créer `src/simulateurs/SimulateurNouveauScenario.jsx` :

```javascript
import React, { useState, useMemo } from 'react';
import Slider from '../components/Slider';
import ResultCard from '../components/ResultCard';
import { SCENARIOS } from '../data/modeles';
import { calculerImpactNouveauScenario } from '../utils/calculs';

export default function SimulateurNouveauScenario() {
  const scenario = SCENARIOS.nouveauScenario;
  
  const [params, setParams] = useState({
    parametre1: scenario.curseurs.parametre1.default,
    // ... tous les paramètres
  });

  const resultats = useMemo(
    () => calculerImpactNouveauScenario(params), 
    [params]
  );

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-cftc-blue to-blue-700 text-white p-6 rounded-lg mb-6">
        <h2 className="text-3xl font-bold mb-2">
          {scenario.nom}
        </h2>
        <p>{scenario.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Curseurs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Slider
              label={scenario.curseurs.parametre1.label}
              value={params.parametre1}
              onChange={(val) => updateParam('parametre1', val)}
              {...scenario.curseurs.parametre1}
            />
            {/* ... autres curseurs */}
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-2">
          <ResultCard
            icon={BriefcaseIcon}
            titre="Impact emploi"
            valeur={formatNumber(resultats.emploi.absolu)}
            // ... autres props
          />
          {/* ... autres ResultCards */}
        </div>
      </div>
    </div>
  );
}
```

### Étape 4 : Intégrer dans App.jsx

```javascript
import SimulateurNouveauScenario from './simulateurs/SimulateurNouveauScenario';

const SCENARIOS_DISPONIBLES = [
  // ... existants
  { id: 'nouveau', nom: '🆕 Mon scénario' }
];

// Dans le render :
{scenarioActif === 'nouveau' && <SimulateurNouveauScenario />}
```

## 📊 Bonnes pratiques modélisation

### 1. Toujours sourcer les paramètres

```javascript
elasticiteEmploi: {
  min: -0.5,
  max: -0.3,
  default: -0.4,
  sources: [
    "Auteur (année) - Titre, Institution",
    "Autre étude pertinente"
  ]
}
```

### 2. Calculer des fourchettes

```javascript
// Fourchette = ±30% autour de la valeur centrale (exemple)
const fourchette = {
  min: Math.round(valeur * 0.7),
  max: Math.round(valeur * 1.3)
};
```

### 3. Décomposer les calculs complexes

```javascript
// ❌ Mauvais : calcul opaque
const resultat = a * b * c / d + e;

// ✅ Bon : étapes commentées
// 1. Effet direct
const effetDirect = a * b;

// 2. Compensation par c
const effetCompense = effetDirect * c;

// 3. Ajustement final
const resultatFinal = (effetCompense / d) + e;
```

### 4. Utiliser les constantes

```javascript
// ❌ Mauvais : valeurs magiques
const cout = salaire * 1.42;

// ✅ Bon : constantes explicites
const TAUX_COTISATIONS_PATRONALES = 0.42;
const cout = salaire * (1 + TAUX_COTISATIONS_PATRONALES);
```

## 🎨 Conventions de design

### Couleurs CFTC
```javascript
colors: {
  cftc: {
    blue: '#003D7A',    // Bleu principal
    red: '#E63946',     // Rouge pour négatif
    green: '#2A9D8F',   // Vert pour positif
  }
}
```

### Icônes (Lucide React)
```javascript
import { 
  Briefcase,      // Emploi
  DollarSign,     // Salaire / Pouvoir d'achat
  TrendingUp,     // Croissance / Inflation
  Building2,      // Entreprises
  Clock,          // Temps de travail
  Leaf,           // Environnement
  Heart,          // Santé
  Globe           // Commerce international
} from 'lucide-react';
```

### Formatage des nombres

```javascript
import { formatNumber, formatPourcent, formatEuro } from '../utils/calculs';

formatNumber(1234567)          // "1.2 M"
formatPourcent(0.123, 1, true) // "+12.3%"
formatEuro(1234567890, 1)      // "1.2 Md€"
```

## 🧪 Tests et validation

### Validation basique
1. Tester avec valeurs min/max de chaque curseur
2. Vérifier cohérence : emploi négatif → chômage monte
3. Fourchettes : min < valeur < max
4. Ordres de grandeur raisonnables

### Tests de régression
Créer des cas de test avec params fixes :

```javascript
// tests/scenarios.test.js
describe('SMIC à 15€', () => {
  it('devrait calculer ~250k pertes emploi (consensus)', () => {
    const params = {
      smicHoraire: 15,
      elasticiteEmploi: -0.5,
      // ...
    };
    const result = calculerImpactSMIC(params);
    expect(result.pertesEmploi.absolu).toBeCloseTo(-250000, -10000);
  });
});
```

## 🚀 Performance

### useMemo pour les calculs lourds
```javascript
// ✅ Recalcule seulement si params changent
const resultats = useMemo(
  () => calculerImpact(params),
  [params]
);

// ❌ Recalcule à chaque render
const resultats = calculerImpact(params);
```

### Graphiques lazy
```javascript
// Charger Recharts seulement quand nécessaire
const Chart = lazy(() => import('./Chart'));
```

## 📱 Responsive design

### Breakpoints Tailwind
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

### Grilles adaptatives
```javascript
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* S'adapte automatiquement */}
</div>
```

## 🐛 Debugging

### React DevTools
- Installer l'extension
- Inspecter props et state
- Profiler les performances

### Console logs utiles
```javascript
console.group('Calcul SMIC');
console.log('Params:', params);
console.log('Résultats:', resultats);
console.groupEnd();
```

## 🔐 Sécurité

### Validation des inputs
```javascript
// Limiter les valeurs aux ranges définis
const updateParam = (key, value) => {
  const { min, max } = scenario.curseurs[key];
  const safeValue = Math.min(Math.max(value, min), max);
  setParams(prev => ({ ...prev, [key]: safeValue }));
};
```

### Pas de data sensibles
- Tout est public (GitHub Pages)
- Pas d'API keys
- Pas de données personnelles

## 📦 Build et déploiement

### Build local
```bash
npm run build
npm run preview  # Tester le build
```

### Optimisations
- Tree shaking automatique (Vite)
- Minification CSS/JS
- Code splitting par route

### GitHub Pages
- Push vers `main` déclenche le déploiement
- Workflow dans `.github/workflows/deploy.yml`
- Vérifier `base` dans `vite.config.js`

## 🤝 Code review checklist

Avant de soumettre une PR :

- [ ] Code commenté (surtout formules économiques)
- [ ] Sources citées pour les nouveaux paramètres
- [ ] Testé sur mobile/tablet/desktop
- [ ] Pas de console.log oubliés
- [ ] README mis à jour si nécessaire
- [ ] Screenshots si changements UI
- [ ] Build réussit (`npm run build`)

## 📚 Ressources utiles

### Documentation
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind](https://tailwindcss.com)
- [Recharts](https://recharts.org)

### Économie
- [CAE - Conseil d'Analyse Économique](https://www.cae-eco.fr)
- [OFCE](https://www.ofce.sciences-po.fr)
- [INSEE](https://www.insee.fr)
- [DARES](https://dares.travail-emploi.gouv.fr)

## 💡 Idées d'amélioration

### Court terme
- [ ] Mode sombre
- [ ] Export PDF des résultats
- [ ] Partage via URL avec params
- [ ] Comparaison côte à côte de 2 scénarios

### Moyen terme
- [ ] API REST pour usage externe
- [ ] Base de données de simulations
- [ ] Système de commentaires
- [ ] Mode "quiz" pédagogique

### Long terme
- [ ] Version multi-pays
- [ ] Modèles régionaux (par région française)
- [ ] Intégration avec données en temps réel (API INSEE)
- [ ] IA pour suggérer des paramètres cohérents

---

**Questions ? Ouvrez une issue sur GitHub !** 🚀
