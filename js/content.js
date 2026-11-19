/*
 * ============================================================
 *  COPILOTE MANAGER — CONTENU ÉDITORIAL
 *  C'est le SEUL fichier à modifier pour changer les textes :
 *  réglages, profils, questions du quiz et fiches.
 * ============================================================
 */
window.CONTENT = {
  /* ---------- Réglages ---------- */
  config: {
    appName: "Copilote Manager",
    tagline: "Nouveau manager ? Découvre ton profil, le piège qui te guette, et la trame pour réussir les 4 situations qui font peur.",

    // Bouton « Aller plus loin » : lien vers ta page de réservation (Calendly, site, etc.)
    // Le profil de l'utilisateur est ajouté automatiquement au lien (?profil=...).
    coachingUrl: "https://koalendar.com/e/toutsimplementmanager",
    coachingTitle: "Accompagnement 1:1",
    coachingPitch:
      "Tu as identifié ton profil et ton piège. L'étape suivante : travailler tes situations réelles en tête-à-tête, avec un plan d'action taillé pour toi.",
    coachingBullets: [
      "Une séance individuelle centrée sur TES situations de management",
      "Un plan d'action concret pour désamorcer ton piège principal",
      "Un suivi entre les séances pour ancrer les nouveaux réflexes",
    ],
    coachingCta: "Réserver mon appel découverte",

    // Optionnel : URL qui reçoit chaque inscription (Make, Zapier, Brevo, Google Apps Script…).
    // Laisser vide pour ne rien envoyer. Données envoyées : prénom, email, date, consentement.
    signupWebhook: "",
    // Optionnel : URL qui reçoit le résultat du quiz (prénom, email, profil, scores).
    resultWebhook: "",
  },

  /* ---------- Les 5 profils managériaux ---------- */
  // L'ordre sert aussi à départager une égalité au quiz.
  profiles: {
    copain: {
      name: "Copain",
      emoji: "🤗",
      color: "#e0803a",
      short: "Tu veux rester proche de ton équipe et préserver la bonne ambiance.",
      description:
        "Tu es apprécié(e), accessible, et ton équipe se sent bien avec toi. Le revers : quand il faut fixer un cadre, dire non ou recadrer, tu as peur d'abîmer la relation… et tu arrondis les angles au point que le message ne passe plus.",
      strengths: ["Proximité", "Bienveillance", "Climat de confiance", "Facile d'accès"],
      trap: "Tu fais passer la relation avant le cadre : tu adoucis les messages difficiles, tu gardes des privilèges pour certains, et ta crédibilité s'effrite.",
      antidote: "Être apprécié n'est pas ton objectif, être respecté l'est. Un message clair est une forme de respect.",
    },
    controlfreak: {
      name: "Control freak",
      emoji: "🎛️",
      color: "#c94a4a",
      short: "Tu veux que tout soit maîtrisé, et souvent à ta façon.",
      description:
        "Tu es fiable, exigeant(e) et tu tiens les délais. Le revers : tu as du mal à lâcher, tu imposes tes solutions et tu finis par tout porter toi-même, au risque de t'épuiser et de déresponsabiliser ton équipe.",
      strengths: ["Fiabilité", "Exigence", "Sens des résultats", "Organisation"],
      trap: "Tu imposes au lieu de faire trouver : tu décides seul(e), tu coupes court aux discussions et tu absorbes tout toi-même.",
      antidote: "Avant de donner ta solution, pose une question et laisse vraiment l'autre répondre.",
    },
    absent: {
      name: "Absent",
      emoji: "🌫️",
      color: "#6b7a99",
      short: "Tu fais confiance… quitte à laisser les problèmes s'installer.",
      description:
        "Tu laisses de l'autonomie et tu ne fais pas de micro-management. Le revers : les conversations difficiles te pèsent, alors tu les repousses, tu passes par mail ou tu espères que ça se règle tout seul… jusqu'à ce que ça explose.",
      strengths: ["Confiance", "Autonomie laissée", "Calme", "Recul"],
      trap: "Tu évites les conversations difficiles : tu repousses, tu passes par écrit, et les problèmes grossissent en silence.",
      antidote: "Une conversation inconfortable aujourd'hui t'en évite une explosive dans un mois. Mets-la dans ton agenda.",
    },
    perfectionniste: {
      name: "Perfectionniste",
      emoji: "🔍",
      color: "#7a5cc9",
      short: "Tu veux bien faire, dans les moindres détails.",
      description:
        "Tu prépares, tu soignes, tu ne laisses rien au hasard. Le revers : tu en fais trop. Trop de reproches, trop de justifications, trop de slides… et ton message se noie dans la quantité.",
      strengths: ["Rigueur", "Préparation", "Souci de la qualité", "Sens du détail"],
      trap: "Tu en fais trop : trop d'arguments, trop de points, un discours trop préparé. Ton message principal se perd.",
      antidote: "Un seul message, trois faits maximum. Si tu ne peux pas le dire en une phrase, ce n'est pas prêt.",
    },
    suiveur: {
      name: "Suiveur",
      emoji: "🧭",
      color: "#2f8f9d",
      short: "Tu relaies fidèlement ta hiérarchie… parfois sans y mettre ta voix.",
      description:
        "Tu es loyal(e), aligné(e) avec ta direction et tu fais avancer les décisions. Le revers : tu te caches derrière « la direction veut que… », tu dis oui à tout, et ton équipe se demande si tu la défendras un jour.",
      strengths: ["Loyauté", "Alignement", "Fiabilité", "Sens du collectif"],
      trap: "Tu n'assumes pas ton rôle : tu te retranches derrière la hiérarchie et tu dis oui à tout, au lieu de porter les messages et de défendre ton équipe.",
      antidote: "Remplace « on m'a demandé de » par « j'ai décidé de » ou « je vous demande de ». Tu es le manager.",
    },
  },

  /* ---------- Le quiz ---------- */
  // Chaque réponse donne 1 point au profil indiqué (p). Le profil au score le plus élevé l'emporte.
  quiz: [
    {
      q: "Un collaborateur arrive en retard pour la troisième fois ce mois-ci. Ton réflexe ?",
      a: [
        { t: "Je lui en parle sur le ton de la blague, je ne veux pas casser l'ambiance.", p: "copain" },
        { t: "Je lui explique comment il doit s'organiser pour être à l'heure.", p: "controlfreak" },
        { t: "J'attends de voir si ça continue avant de dire quoi que ce soit.", p: "absent" },
        { t: "Je note tout ce qui ne va pas chez lui pour lui faire un point complet.", p: "perfectionniste" },
        { t: "Je lui rappelle que la direction est très attentive aux horaires.", p: "suiveur" },
      ],
    },
    {
      q: "Tu viens d'être nommé(e) manager de ton ancienne équipe. Ta crainte principale ?",
      a: [
        { t: "Perdre mes amis au travail.", p: "copain" },
        { t: "Que les choses ne soient pas faites comme il faut.", p: "controlfreak" },
        { t: "Devoir avoir des conversations gênantes.", p: "absent" },
        { t: "Ne pas être à la hauteur dès le premier jour.", p: "perfectionniste" },
        { t: "Ne pas répondre aux attentes de ma hiérarchie.", p: "suiveur" },
      ],
    },
    {
      q: "La direction annonce une décision que tu trouves mauvaise. Devant ton équipe, tu…",
      a: [
        { t: "Avoues que tu n'es pas d'accord non plus.", p: "copain" },
        { t: "Annonces la décision et passes vite au sujet suivant.", p: "controlfreak" },
        { t: "Fais passer l'info par mail.", p: "absent" },
        { t: "Prépares une longue explication pour justifier chaque point.", p: "perfectionniste" },
        { t: "Reprends le message de la direction tel quel.", p: "suiveur" },
      ],
    },
    {
      q: "Ton N+1 te confie un nouveau projet alors que l'équipe est déjà débordée. Tu…",
      a: [
        { t: "Dis oui pour ne pas froisser ton N+1.", p: "copain" },
        { t: "Dis oui et tu t'en charges toi-même, le soir s'il le faut.", p: "controlfreak" },
        { t: "Ne dis rien sur le moment et tu verras bien.", p: "absent" },
        { t: "Prépares un dossier très complet pour démontrer la surcharge.", p: "perfectionniste" },
        { t: "Acceptes : si la direction le demande, c'est que c'est prioritaire.", p: "suiveur" },
      ],
    },
    {
      q: "Un membre de l'équipe rend un travail moyen. Tu…",
      a: [
        { t: "Le remercies quand même, il a fait de son mieux.", p: "copain" },
        { t: "Le reprends toi-même, ce sera plus rapide.", p: "controlfreak" },
        { t: "Laisses passer, ce n'est pas si grave.", p: "absent" },
        { t: "Lui renvoies avec une liste détaillée de corrections.", p: "perfectionniste" },
        { t: "Lui rappelles les standards attendus par la direction.", p: "suiveur" },
      ],
    },
    {
      q: "En réunion d'équipe, on te reproche plutôt de…",
      a: [
        { t: "Laisser la réunion partir en discussion sympa mais pas très productive.", p: "copain" },
        { t: "Monopoliser la parole et décider seul(e).", p: "controlfreak" },
        { t: "Annuler ou espacer les réunions.", p: "absent" },
        { t: "Faire des réunions trop longues et trop détaillées.", p: "perfectionniste" },
        { t: "Faire surtout le relais des messages d'en haut.", p: "suiveur" },
      ],
    },
    {
      q: "Quand tu dois dire quelque chose de désagréable, tu as tendance à…",
      a: [
        { t: "Enrober le message pour ne blesser personne.", p: "copain" },
        { t: "Aller droit au but et donner la solution.", p: "controlfreak" },
        { t: "Repousser le moment le plus longtemps possible.", p: "absent" },
        { t: "Préparer ton discours mot pour mot pendant des heures.", p: "perfectionniste" },
        { t: "Dire que ce n'est pas toi qui as décidé.", p: "suiveur" },
      ],
    },
    {
      q: "Le soir, ce qui t'empêche le plus de décrocher :",
      a: [
        { t: "Une tension avec quelqu'un de l'équipe.", p: "copain" },
        { t: "Les dossiers que tu n'as pas pu vérifier toi-même.", p: "controlfreak" },
        { t: "La conversation que tu n'as toujours pas eue.", p: "absent" },
        { t: "Le détail qui n'était pas parfait.", p: "perfectionniste" },
        { t: "Ce que ta hiérarchie pense de ton travail.", p: "suiveur" },
      ],
    },
    {
      q: "Deux collaborateurs sont en conflit. Tu…",
      a: [
        { t: "Essaies de détendre l'atmosphère avec un afterwork.", p: "copain" },
        { t: "Tranches et tu imposes une organisation.", p: "controlfreak" },
        { t: "Les laisses régler ça entre eux.", p: "absent" },
        { t: "Analyses la situation en profondeur avant d'agir.", p: "perfectionniste" },
        { t: "Remontes le sujet aux RH ou à ton N+1.", p: "suiveur" },
      ],
    },
    {
      q: "Ce que tu aimerais entendre de ton équipe :",
      a: [
        { t: "« On t'adore, tu es resté(e) le/la même. »", p: "copain" },
        { t: "« Avec toi, tout est carré. »", p: "controlfreak" },
        { t: "« Tu nous laisses vraiment libres. »", p: "absent" },
        { t: "« Tu ne laisses rien au hasard. »", p: "perfectionniste" },
        { t: "« Tu connais parfaitement les attentes de la direction. »", p: "suiveur" },
      ],
    },
  ],

  /* ---------- Les 4 fiches ---------- */
  // Modèle commun : cadrage, trame, réactions probables, piège selon le profil, débrief.
  fiches: [
    {
      id: "recadrer",
      emoji: "🎯",
      title: "Recadrer un collaborateur",
      summary: "Traiter un comportement qui pose problème, sans tourner autour du pot.",
      duration: "15 à 20 min, en tête-à-tête, jamais devant l'équipe.",
      framing: [
        "Quel est le fait précis ? (ex. : 3 retards ce mois-ci, pas « il est souvent en retard »)",
        "Est-ce la première fois que tu en parles ?",
        "Quel changement concret attends-tu ?",
      ],
      steps: [
        { t: "Ouvrir sans tourner autour du pot", d: "« Je voulais te voir pour parler d'un point qui me pose problème. »" },
        { t: "Énoncer le fait, rien que le fait", d: "« Tu es arrivé en retard lundi, mercredi et jeudi. »" },
        { t: "Expliquer l'impact", d: "« Quand tu arrives après 9 h, c'est Julie qui prend tes appels en plus des siens. »" },
        { t: "Écouter, vraiment", d: "« Qu'est-ce qui se passe de ton côté ? » Puis tu te tais et tu laisses le silence travailler." },
        { t: "Fixer l'attente", d: "« Ce que j'attends, c'est que tu sois à ton poste à 9 h, à partir de lundi. »" },
        { t: "Obtenir un engagement", d: "« Qu'est-ce que tu peux mettre en place pour que ça marche ? »" },
        { t: "Annoncer le suivi", d: "« On refait un point dans deux semaines. »" },
      ],
      reactions: [
        { r: "« Les autres aussi arrivent en retard ! »", a: "« On parle de toi aujourd'hui. Si un autre est concerné, je le verrai avec lui. »" },
        { r: "« C'est pas si grave… »", a: "« Pour moi, ça l'est, et je t'ai expliqué pourquoi. »" },
        { r: "Une raison personnelle difficile", a: "« Merci de me le dire. Cherchons une solution ensemble, mais l'objectif reste le même. »" },
        { r: "Le silence ou la bouderie", a: "« Je vois que ce n'est pas agréable à entendre. Est-ce que l'attente est claire pour toi ? »" },
      ],
      traps: {
        copain: "Tu adoucis tellement le message qu'il ne passe pas.",
        controlfreak: "Tu imposes la solution au lieu de la faire trouver.",
        absent: "Tu repousses l'échange jusqu'à ce que ça explose.",
        perfectionniste: "Tu listes 8 reproches au lieu d'un seul.",
        suiveur: "Tu dis « la direction veut que… » au lieu d'assumer.",
      },
      debrief: [
        "Ai-je parlé d'un fait ou d'un jugement ?",
        "A-t-il pris un engagement concret ?",
        "Ai-je fixé une date de suivi ?",
      ],
    },
    {
      id: "ancien-collegue",
      emoji: "🤝",
      title: "Manager un ancien collègue",
      summary: "Poser le nouveau cadre de la relation, sans la sacrifier.",
      duration: "30 min, en tête-à-tête, dans les deux premières semaines après la nomination. Plus tu attends, plus l'ambiguïté s'installe.",
      framing: [
        "Quelle relation aviez-vous avant ? (simple collègue, ami proche, rival sur le même poste)",
        "Qu'est-ce qui te met mal à l'aise aujourd'hui ? (les pauses café, les confidences, le fait de lui donner des consignes)",
        "Qu'est-ce qui doit changer concrètement dans votre façon de travailler ensemble ?",
      ],
      steps: [
        { t: "Nommer l'éléphant dans la pièce", d: "« On sait tous les deux que la situation a changé, et je préfère qu'on en parle franchement plutôt que de faire comme si de rien n'était. »" },
        { t: "Reconnaître ce qui ne change pas", d: "« Je t'apprécie et je respecte ton travail. Ça, ça ne bouge pas. »" },
        { t: "Dire ce qui change", d: "« Par contre, je vais devoir prendre des décisions qui te concernent, te donner des retours, parfois te dire non. »" },
        { t: "Lui donner la parole", d: "« Comment tu le vis, toi ? Qu'est-ce qui t'inquiète ? »" },
        { t: "Poser les règles du jeu ensemble", d: "« Qu'est-ce qui t'aiderait pour que ça se passe bien entre nous ? » Puis tu proposes les tiennes : pas de traitement de faveur, les sujets d'équipe se discutent en équipe." },
        { t: "Acter la suite", d: "« Si quelque chose te gêne dans ma façon de faire, je veux que tu me le dises directement. Moi, je ferai pareil. »" },
      ],
      reactions: [
        { r: "« T'inquiète, rien ne change entre nous ! »", a: "« J'aimerais que ce soit vrai, mais certaines choses vont changer, et je préfère qu'on le dise maintenant plutôt que de se blesser plus tard. »" },
        { r: "Une pointe d'amertume (« C'est toi qui as eu le poste… »)", a: "« Je comprends que ce soit difficile. Ta place dans l'équipe compte, et je veux t'aider à avancer toi aussi. »" },
        { r: "Il teste ta légitimité (« Avant, on faisait comme ça… »)", a: "« Je t'écoute, et on peut en discuter. La décision finale me revient, mais ton avis compte. »" },
        { r: "Il continue de te parler comme avant devant l'équipe", a: "En privé : « Je t'adore, mais devant l'équipe, j'ai besoin que tu respectes mes décisions. On en débat en tête-à-tête si tu n'es pas d'accord. »" },
      ],
      traps: {
        copain: "Tu gardes les confidences et les privilèges, et le reste de l'équipe le voit.",
        controlfreak: "Tu surcompenses en devenant rigide et froid du jour au lendemain.",
        absent: "Tu évites cette conversation et tu espères que ça se règle tout seul.",
        perfectionniste: "Tu prépares un discours parfait qui sonne faux.",
        suiveur: "Tu te caches derrière ta hiérarchie (« on m'a demandé de… ») pour ne pas assumer le nouveau rôle.",
      },
      debrief: [
        "Ai-je dit clairement ce qui change ?",
        "L'ai-je laissé exprimer ce qu'il ressent ?",
        "Avons-nous posé au moins une règle commune ?",
      ],
    },
    {
      id: "decision",
      emoji: "📣",
      title: "Annoncer une décision qu'on ne partage pas",
      summary: "Porter une décision de la direction sans te désolidariser ni réciter.",
      duration: "10 à 15 min en réunion d'équipe, puis un temps en individuel pour ceux qui sont le plus impactés.",
      framing: [
        "Quelle est la décision, en une phrase ?",
        "Quelles sont les raisons qu'on t'a données ? (si tu ne les connais pas, va les chercher avant l'annonce)",
        "Qui sera le plus impacté dans ton équipe, et comment ?",
      ],
      steps: [
        { t: "Annoncer la décision tout de suite", d: "« J'ai une décision à vous partager : à partir du 1er janvier, les horaires passent à 8 h 30 – 17 h. »" },
        { t: "Expliquer le pourquoi", d: "« La raison, c'est que nos clients nous appellent majoritairement avant 9 h. »" },
        { t: "Reconnaître l'impact", d: "« Je sais que ça change l'organisation de certains d'entre vous, notamment pour les enfants. »" },
        { t: "Assumer sans trahir", d: "« Ce n'est pas la décision que j'aurais prise spontanément, et je l'ai dit. Elle est prise, et je vais la porter avec vous. »" },
        { t: "Ouvrir sur ce qui est négociable", d: "« Ce qui est fixé : les horaires. Ce qu'on peut organiser ensemble : les roulements et la transition. »" },
        { t: "Donner la suite", d: "« Je vous vois chacun cette semaine pour voir comment ça se passe pour vous. »" },
      ],
      reactions: [
        { r: "« Et toi, t'en penses quoi ? »", a: "« J'ai donné mon avis à la direction. Maintenant, mon rôle est de nous aider à faire en sorte que ça marche. »" },
        { r: "« C'est n'importe quoi ! »", a: "« Je comprends la frustration. Qu'est-ce qui te pose le plus problème ? On regarde ce qu'on peut ajuster. »" },
        { r: "« On n'a qu'à refuser ! »", a: "« La décision est prise. Ce sur quoi on a la main, c'est la mise en place. »" },
        { r: "Le silence total", a: "« Je sens que ça ne passe pas facilement. Ma porte est ouverte cette semaine, pour en parler en tête-à-tête. »" },
      ],
      traps: {
        copain: "Tu te désolidarises (« moi non plus je ne suis pas d'accord, mais bon… ») et tu perds ta crédibilité auprès de tous.",
        controlfreak: "Tu coupes court à toute discussion, ce qui fait monter la frustration.",
        absent: "Tu envoies l'info par mail et tu laisses l'équipe se débrouiller.",
        perfectionniste: "Tu sur-justifies pendant 20 minutes et tout le monde décroche.",
        suiveur: "Tu récites le discours de la direction sans y mettre un mot à toi.",
      },
      debrief: [
        "Ai-je annoncé la décision dans la première minute ?",
        "Ai-je expliqué le pourquoi, et pas seulement le quoi ?",
        "Ai-je dit clairement ce qui était négociable ou non ?",
      ],
    },
    {
      id: "dire-non",
      emoji: "✋",
      title: "Dire non à sa hiérarchie",
      summary: "Protéger ton équipe avec des faits et une alternative, pas une plainte.",
      duration: "15 min, en tête-à-tête avec ton N+1, préparé à l'avance. Jamais à chaud dans le couloir.",
      framing: [
        "Qu'est-ce qu'on te demande exactement, et pour quand ?",
        "Quel est le vrai problème ? (charge de l'équipe, délai, moyens, risque qualité)",
        "Quelle alternative peux-tu proposer ?",
      ],
      steps: [
        { t: "Montrer que tu as compris l'enjeu", d: "« Je comprends que ce projet est prioritaire pour la direction et qu'il faut le livrer avant la fin du trimestre. »" },
        { t: "Poser les faits", d: "« Aujourd'hui, l'équipe est sur trois dossiers en parallèle, et deux personnes sont absentes ce mois-ci. »" },
        { t: "Dire le risque, pas l'émotion", d: "« Si on ajoute ce projet sans rien changer, on va rater les délais sur le dossier X, ou livrer un travail de mauvaise qualité. »" },
        { t: "Proposer une alternative", d: "« Je propose qu'on décale le dossier X de deux semaines, ou qu'on livre une première version du projet en janvier. »" },
        { t: "Laisser ton N+1 arbitrer", d: "« Laquelle de ces options te semble la plus pertinente ? »" },
        { t: "Acter par écrit", d: "« Je te fais un mail récapitulatif pour qu'on soit alignés. »" },
      ],
      reactions: [
        { r: "« Il va falloir faire avec. »", a: "« D'accord. Dans ce cas, quelle priorité je mets en pause ? Je ne peux pas tout tenir sans dégrader quelque chose. »" },
        { r: "« Les autres équipes y arrivent bien, elles. »", a: "« Je n'ai pas leurs chiffres. Voici les miens, et voici ce que ça implique pour nous. »" },
        { r: "« Tu ne sais pas motiver ton équipe ? »", a: "« L'équipe est motivée. Le sujet, c'est la capacité, pas l'envie. »" },
        { r: "Il accepte ta proposition", a: "Tu remercies et tu envoies le mail récapitulatif dans l'heure." },
      ],
      traps: {
        copain: "Tu dis oui pour garder une bonne relation avec ton N+1, puis tu fais porter la surcharge à l'équipe.",
        controlfreak: "Tu dis oui et tu absorbes tout toi-même jusqu'à l'épuisement.",
        absent: "Tu ne dis rien, et tu laisses le problème éclater au moment de la livraison.",
        perfectionniste: "Tu arrives avec un dossier de 15 slides au lieu de 3 faits clairs.",
        suiveur: "Tu dis oui à tout, et ton équipe comprend que tu ne la défendras jamais.",
      },
      debrief: [
        "Suis-je arrivé avec des faits plutôt qu'une plainte ?",
        "Ai-je proposé au moins une alternative ?",
        "La décision finale a-t-elle été actée par écrit ?",
      ],
    },
  ],

  /* ---------- Débrief ---------- */
  debriefAnswers: [
    { v: "oui", label: "Oui", score: 1 },
    { v: "partiel", label: "En partie", score: 0.5 },
    { v: "non", label: "Non", score: 0 },
  ],
  debriefLastQuestion: "Ce que je ferai différemment la prochaine fois",
};
