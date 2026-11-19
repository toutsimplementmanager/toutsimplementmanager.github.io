# Recevoir les inscrits dans un Google Sheet

Durée : 5 minutes.

1. Crée un nouveau **Google Sheet** (par exemple « Copilote Manager – Inscrits »).
2. Menu **Extensions → Apps Script**.
3. Supprime le code présent et **colle tout le contenu de `Code.gs`**. Clique sur 💾 Enregistrer.
4. (Facultatif) En haut, choisis la fonction `testInstallation` et clique sur **Exécuter**. Google demande des autorisations : accepte-les (« Paramètres avancés → Accéder au projet » si un avertissement s'affiche, c'est normal pour ton propre script). Un onglet **Inscrits** apparaît avec une ligne « Test » : tu peux la supprimer.
5. Clique sur **Déployer → Nouveau déploiement**.
   - Type : **Application Web** (icône ⚙️ à côté de « Sélectionner le type »)
   - Exécuter en tant que : **Moi**
   - Qui peut accéder : **Tout le monde**
   - Clique sur **Déployer** et accepte les autorisations.
6. **Copie l'URL de l'application Web** (elle se termine par `/exec`) et colle-la dans `js/content.js`, à `signupWebhook` et `resultWebhook`.

Le tableau contient une ligne par inscrit : date d'inscription, prénom, email, consentement, profil (mis à jour à chaque quiz), date et nombre de quiz, scores.

⚠️ N'envoie des emails de prospection **qu'aux personnes dont la colonne « consentement » est à « Oui »**.

Si tu modifies le script plus tard : **Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version → Déployer** (l'URL reste la même).
