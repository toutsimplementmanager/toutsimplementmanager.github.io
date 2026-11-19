# Copilote Manager

Votre copilote pour piloter votre équipe au quotidien : one-to-one, tâches, objectifs et feedbacks — avec un assistant qui vous dit **quoi faire ensuite**.

## Fonctionnalités

- **Tableau de bord** : indicateurs clés (tâches ouvertes / en retard, humeur moyenne de l'équipe) et suggestions du copilote.
- **Copilote** : détecte les 1:1 en retard par rapport au rythme choisi, les collaborateurs en difficulté, les tâches en retard, les risques de surcharge, les objectifs menacés, les feedbacks oubliés, les périodes d'intégration et les anniversaires d'ancienneté.
- **Équipe** : fiche par collaborateur (poste, date d'arrivée, rythme de 1:1, notes) avec historique complet.
- **One-to-one** : prise de notes, humeur perçue, actions décidées (transformées automatiquement en tâches) et **trame de préparation générée** à partir de l'historique.
- **Tâches** : tableau Kanban (À faire / En cours / Terminé) avec glisser-déposer, priorités et échéances.
- **Objectifs** : objectifs d'équipe ou individuels, résultats clés et avancement.
- **Feedbacks** : journal de feedbacks positifs et constructifs, avec trame SBI (Situation – Comportement – Impact).
- **Données** : export / import JSON, données de démonstration, réinitialisation.

Les données restent **dans votre navigateur** (localStorage) : rien n'est envoyé sur un serveur.

## Lancer l'application

Aucune installation nécessaire :

```bash
# depuis le dossier du projet
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Vous pouvez aussi simplement ouvrir `index.html` dans votre navigateur, ou publier le dossier sur n'importe quel hébergement statique (GitHub Pages, Netlify, Vercel…). L'application est installable sur mobile (PWA).

## Structure

```
index.html            Structure de la page
css/style.css         Styles (clair / sombre, responsive)
js/store.js           Stockage des données et données de démo
js/copilot.js         Moteur de suggestions et préparation des 1:1
js/app.js             Interface, navigation et formulaires
```
