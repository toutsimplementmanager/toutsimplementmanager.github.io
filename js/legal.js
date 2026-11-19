/*
 * ============================================================
 *  COPILOTE MANAGER — MENTIONS LÉGALES ET CONFIDENTIALITÉ
 *  Modifier ici les informations de l'éditeur (ex. ajouter le SIRET).
 * ============================================================
 */
window.LEGAL = {
  owner: "Jean-François Guckert",
  brand: "Tout simplement manager",
  email: "toutsimplementjeff@gmail.com",
  // À compléter dès l'immatriculation (ex. "Entrepreneur individuel – SIRET 123 456 789 00012").
  status: "",
  siret: "",
  updated: "19 novembre 2026",
  host: {
    name: "GitHub, Inc. (service GitHub Pages)",
    address: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis",
    site: "https://github.com",
  },
};

window.LEGAL_PAGES = {
  mentions(L) {
    return `
      <h1>Mentions légales</h1>
      <p class="muted small">Dernière mise à jour : ${L.updated}</p>
      <div class="card legal">
        <h3>Éditeur de l'application</h3>
        <p>${L.owner}${L.brand ? ` — ${L.brand}` : ''}<br>
        ${L.status ? L.status + '<br>' : ''}${L.siret ? 'SIRET : ' + L.siret + '<br>' : 'Activité en cours de création (numéro SIRET à venir).<br>'}
        Contact : <a href="mailto:${L.email}">${L.email}</a></p>
        <h3>Directeur de la publication</h3>
        <p>${L.owner}</p>
        <h3>Hébergement</h3>
        <p>${L.host.name}<br>${L.host.address}<br><a href="${L.host.site}" target="_blank" rel="noopener">${L.host.site}</a></p>
        <h3>Propriété intellectuelle</h3>
        <p>L'ensemble des contenus de l'application (textes, quiz, fiches, profils) est la propriété de ${L.owner}. Toute reproduction ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.</p>
        <h3>Responsabilité</h3>
        <p>Les fiches et conseils proposés sont des outils d'aide à la réflexion. Ils ne remplacent pas un accompagnement personnalisé ni un avis juridique ou RH. Chaque utilisateur reste responsable de l'usage qu'il en fait.</p>
        <h3>Données personnelles</h3>
        <p>Voir la <a href="#/confidentialite">politique de confidentialité</a>.</p>
      </div>`;
  },

  confidentialite(L) {
    return `
      <h1>Politique de confidentialité</h1>
      <p class="muted small">Dernière mise à jour : ${L.updated}</p>
      <div class="card legal">
        <h3>Qui est responsable de tes données ?</h3>
        <p>${L.owner}${L.brand ? ` (${L.brand})` : ''}, joignable à <a href="mailto:${L.email}">${L.email}</a>.</p>

        <h3>Quelles données, et où vont-elles ?</h3>
        <p><b>Transmises à ${L.owner}</b> lors de ton inscription et de chaque quiz :</p>
        <ul>
          <li>ton prénom et ton adresse email ;</li>
          <li>ton choix concernant la réception de conseils (case à cocher) ;</li>
          <li>ton profil managérial, tes scores au quiz et leur date.</li>
        </ul>
        <p><b>Conservées uniquement sur ton appareil</b> (dans ton navigateur), jamais transmises :</p>
        <ul>
          <li>ton mot de passe (enregistré sous forme chiffrée irréversible) ;</li>
          <li>tes débriefs et ton historique ;</li>
          <li>tes réponses détaillées au quiz.</li>
        </ul>

        <h3>Pourquoi ?</h3>
        <ul>
          <li><b>Te donner accès à l'application</b> et te proposer les fiches adaptées à ton profil (exécution du service que tu demandes).</li>
          <li><b>T'envoyer des conseils de management et des informations sur l'accompagnement 1:1</b>, uniquement si tu as coché la case prévue (consentement, que tu peux retirer à tout moment).</li>
        </ul>
        <p>Tes données ne sont jamais vendues ni louées.</p>

        <h3>Qui y a accès ?</h3>
        <p>Uniquement ${L.owner}. Pour fonctionner, l'application s'appuie sur deux prestataires techniques :</p>
        <ul>
          <li><b>Google</b> (Google Sheets), qui stocke la liste des inscrits ;</li>
          <li><b>GitHub</b> (GitHub Pages), qui héberge l'application et peut enregistrer des données techniques de connexion (adresse IP) pour des raisons de sécurité.</li>
        </ul>
        <p>Ces prestataires peuvent traiter des données aux États-Unis. Ces transferts sont encadrés par le Data Privacy Framework UE–États-Unis et/ou les clauses contractuelles types de la Commission européenne.</p>
        <p>La prise de rendez-vous via le bouton « Aller plus loin » se fait sur le site Koalendar, qui dispose de sa propre politique de confidentialité.</p>

        <h3>Combien de temps ?</h3>
        <p>Tes données sont conservées jusqu'à ta demande de suppression, et au plus 3 ans après ton dernier contact avec ${L.owner}. Les données stockées sur ton appareil y restent jusqu'à ce que tu supprimes ton compte ou les données de ton navigateur.</p>

        <h3>Cookies</h3>
        <p>L'application n'utilise ni cookie publicitaire, ni outil de mesure d'audience. Elle utilise uniquement le stockage local de ton navigateur, indispensable à son fonctionnement (garder ta session et tes débriefs).</p>

        <h3>Tes droits</h3>
        <p>Tu peux à tout moment accéder à tes données, les corriger, les faire supprimer, t'opposer à leur utilisation, en limiter l'usage, les récupérer, ou retirer ton consentement aux envois de conseils. Il suffit d'écrire à <a href="mailto:${L.email}">${L.email}</a>.</p>
        <p>Le bouton « Supprimer mon compte » efface les données de ton appareil. Pour être aussi retiré(e) de la liste des inscrits, écris à l'adresse ci-dessus.</p>
        <p>Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).</p>
      </div>`;
  },
};
