# Copilote Manager — v1

Application web qui fait découvrir son **profil managérial** à un manager, lui montre **le piège qui le guette** dans chaque situation clé, et l'amène vers un **accompagnement 1:1**.

## Parcours

1. **Inscription** (prénom, email, mot de passe, consentement marketing facultatif).
2. **Quiz de profil managérial** : 10 questions, 5 profils (Copain, Control freak, Absent, Perfectionniste, Suiveur).
3. **Résultat** : profil, forces, piège principal + antidote, répartition des styles. Le quiz peut être refait.
4. **Les 4 fiches** (Recadrer un collaborateur, Manager un ancien collègue, Annoncer une décision qu'on ne partage pas, Dire non à sa hiérarchie), toutes sur le même modèle : durée, 3 questions de cadrage, trame, réactions probables, **piège selon le profil** et débrief de 2 minutes.
5. **Débrief de 2 minutes** : les 3 questions propres à la fiche (Oui / En partie / Non) + « ce que je ferai différemment », **sauvegardé dans l'historique** (statistiques, filtre par fiche, détail, suppression).
6. Bouton **« Aller plus loin »** partout → page d'accompagnement 1:1 personnalisée selon le profil → lien de réservation externe (le profil est transmis dans l'URL).

## Personnaliser le contenu

Tout le contenu éditorial se trouve dans **`js/content.js`** : textes d'accueil, profils, questions du quiz, fiches, pièges et antidotes, page d'accompagnement.

À faire avant la mise en ligne :
- `coachingUrl` : ton lien de réservation (Calendly, site…).
- `signupWebhook` / `resultWebhook` (facultatif) : une URL (Make, Zapier, Brevo, Google Apps Script…) qui recevra chaque inscription et chaque résultat de quiz, pour récupérer les contacts.

## Lancer en local

```bash
python3 -m http.server 8000   # puis ouvrir http://localhost:8000
```

Pour le mettre en ligne : déposer le dossier sur n'importe quel hébergement statique (Netlify, Vercel, GitHub Pages…). L'application peut être installée sur l'écran d'accueil d'un téléphone.

## Limites de la v1

Les comptes et débriefs sont enregistrés **dans le navigateur de l'utilisateur** (pas de serveur) : un compte créé sur téléphone n'est pas retrouvé sur ordinateur, et il n'y a pas de « mot de passe oublié ». Les webhooks permettent néanmoins de récupérer les inscriptions de ton côté. Une v2 pourra ajouter une vraie base de données (ex. Supabase ou Firebase).

## Structure

```
index.html        Structure de la page
css/style.css     Design (clair/sombre, mobile d'abord)
js/content.js     ← Contenu éditorial et réglages
js/store.js       Comptes, résultats, débriefs (localStorage) et webhooks
js/app.js         Parcours, écrans et navigation
```
