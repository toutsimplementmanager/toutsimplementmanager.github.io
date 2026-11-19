/*
 * ============================================================
 *  COPILOTE MANAGER — CONTENU ÉDITORIAL
 *  C'est le SEUL fichier à modifier pour changer les textes :
 *  réglages, profils, questions du quiz, fiches et pièges.
 * ============================================================
 */
window.CONTENT = {
  /* ---------- Réglages ---------- */
  config: {
    appName: 'Copilote Manager',
    tagline: 'Découvre ton profil de manager et évite les pièges qui te freinent.',

    // Bouton « Aller plus loin » : lien vers ta page de réservation (Calendly, site, etc.)
    // Le profil de l'utilisateur est ajouté automatiquement au lien (?profil=...).
    coachingUrl: 'https://calendly.com/ton-lien',
    coachingTitle: 'Accompagnement 1:1',
    coachingPitch:
      "Tu as identifié ton profil et tes pièges. L'étape suivante : travailler tes situations réelles en tête-à-tête, avec un plan d'action taillé pour toi.",
    coachingBullets: [
      'Une séance individuelle centrée sur TES situations de management',
      'Un plan d\'action concret pour désamorcer ton piège principal',
      'Un suivi entre les séances pour ancrer les nouveaux réflexes',
    ],
    coachingCta: 'Réserver mon appel découverte',

    // Optionnel : URL qui reçoit chaque inscription (Make, Zapier, Brevo, Google Apps Script…).
    // Laisser vide pour ne rien envoyer. Données envoyées : prénom, email, date, consentement.
    signupWebhook: '',
    // Optionnel : URL qui reçoit le résultat du quiz (prénom, email, profil, scores).
    resultWebhook: '',
  },

  /* ---------- Les 4 profils managériaux ---------- */
  profiles: {
    capitaine: {
      name: 'Le Capitaine',
      emoji: '🧭',
      color: '#dc5b3c',
      short: 'Tu donnes le cap, tu décides, tu avances.',
      description:
        "Tu es à l'aise pour trancher, fixer des objectifs clairs et tenir le rythme. Dans la tempête, ton équipe sait qu'elle peut compter sur toi pour décider. Ton énergie est communicative et tu obtiens des résultats.",
      strengths: ['Prise de décision rapide', 'Cadre et objectifs clairs', 'Sens des résultats', 'Solide en situation de crise'],
      trap: "Tout porter seul : tu décides à la place de l'équipe, tu contrôles beaucoup, et tes collaborateurs finissent par attendre tes instructions au lieu de prendre des initiatives.",
      antidote: 'Avant de décider, pose une question ouverte et laisse 10 secondes de silence.',
    },
    coach: {
      name: 'Le Coach',
      emoji: '🎓',
      color: '#7c5cd6',
      short: 'Tu expliques, tu transmets, tu fais grandir.',
      description:
        "Tu aimes faire progresser les autres. Tu prends le temps d'expliquer le pourquoi, tu donnes du sens et tu sais convaincre. Ton équipe apprend beaucoup à tes côtés.",
      strengths: ['Pédagogie', 'Donner du sens', 'Motiver par la conviction', 'Développer les compétences'],
      trap: "Trop parler et trop convaincre : tu expliques tellement que tu n'écoutes plus vraiment, et tu cherches l'adhésion là où il faudrait parfois simplement décider.",
      antidote: "Parle 30 % du temps maximum : ton rôle est de faire trouver, pas d'expliquer.",
    },
    federateur: {
      name: 'Le Fédérateur',
      emoji: '🤝',
      color: '#1f9d7a',
      short: "Tu écoutes, tu rassembles, tu crées l'adhésion.",
      description:
        "Tu crées un climat de confiance où chacun ose s'exprimer. Tu consultes, tu impliques, et les décisions sont portées par tout le groupe. L'ambiance de ton équipe est ton point fort.",
      strengths: ['Écoute active', 'Climat de confiance', 'Intelligence collective', 'Cohésion d\'équipe'],
      trap: "Éviter le conflit : tu repousses les sujets qui fâchent, tu cherches le consensus à tout prix et certaines décisions traînent… au risque de laisser pourrir les situations.",
      antidote: 'Fixe une date de décision dès le début de la concertation, et tiens-la.',
    },
    eclaireur: {
      name: "L'Éclaireur",
      emoji: '🚀',
      color: '#2f7fd8',
      short: "Tu fais confiance, tu donnes de l'autonomie, tu vises loin.",
      description:
        "Tu fais confiance à ton équipe et tu lui laisses de l'espace. Tu penses vision et long terme, et tu sais mettre chacun en responsabilité. Les profils autonomes s'épanouissent avec toi.",
      strengths: ['Confiance et autonomie', 'Vision à long terme', 'Responsabilisation', 'Innovation'],
      trap: "Lâcher trop tôt : tu délègues sans cadre ni suivi, tu es peu disponible, et certains collaborateurs se sentent seuls face aux difficultés.",
      antidote: 'Pas de délégation sans point de suivi daté dans ton agenda.',
    },
  },

  /* ---------- Le quiz ---------- */
  // Chaque réponse donne 1 point au profil indiqué. Le profil au score le plus élevé l'emporte.
  quiz: [
    {
      q: 'Un projet urgent tombe un vendredi à 17 h. Ton premier réflexe ?',
      a: [
        { t: 'Je répartis les tâches immédiatement et je fixe les échéances.', p: 'capitaine' },
        { t: "J'explique à l'équipe pourquoi c'est important avant de lancer le travail.", p: 'coach' },
        { t: 'Je réunis l\'équipe pour décider ensemble de l\'organisation.', p: 'federateur' },
        { t: 'Je confie le projet à la personne la plus à même de le piloter.', p: 'eclaireur' },
      ],
    },
    {
      q: 'Un collaborateur fait une erreur importante. Tu…',
      a: [
        { t: 'Recadres rapidement et définis comment éviter que ça se reproduise.', p: 'capitaine' },
        { t: "Prends le temps de lui expliquer ce qui n'a pas marché et comment faire mieux.", p: 'coach' },
        { t: "Lui demandes comment il l'a vécu et ce dont il aurait besoin.", p: 'federateur' },
        { t: 'Le laisses analyser lui-même et te proposer une solution.', p: 'eclaireur' },
      ],
    },
    {
      q: 'En réunion d\'équipe, tu es plutôt celui ou celle qui…',
      a: [
        { t: "Cadre l'ordre du jour et veille aux décisions.", p: 'capitaine' },
        { t: 'Partage le contexte et donne du sens.', p: 'coach' },
        { t: 'Fait parler tout le monde.', p: 'federateur' },
        { t: "Ouvre des pistes et laisse l'équipe s'organiser.", p: 'eclaireur' },
      ],
    },
    {
      q: 'Ce qui te procure le plus de satisfaction au travail :',
      a: [
        { t: 'Atteindre (et dépasser) les objectifs.', p: 'capitaine' },
        { t: "Voir quelqu'un progresser grâce à toi.", p: 'coach' },
        { t: 'Une équipe soudée où chacun se sent bien.', p: 'federateur' },
        { t: 'Une équipe qui tourne sans toi.', p: 'eclaireur' },
      ],
    },
    {
      q: 'Deux membres de ton équipe sont en désaccord. Tu…',
      a: [
        { t: 'Tranches pour débloquer la situation.', p: 'capitaine' },
        { t: 'Expliques à chacun le point de vue de l\'autre.', p: 'coach' },
        { t: 'Organises un échange pour qu\'ils trouvent un terrain d\'entente.', p: 'federateur' },
        { t: 'Les laisses régler ça entre adultes.', p: 'eclaireur' },
      ],
    },
    {
      q: 'On te dit souvent que tu es…',
      a: [
        { t: 'Exigeant(e) et efficace.', p: 'capitaine' },
        { t: 'Inspirant(e) et pédagogue.', p: 'coach' },
        { t: 'À l\'écoute et bienveillant(e).', p: 'federateur' },
        { t: 'Visionnaire et peu interventionniste.', p: 'eclaireur' },
      ],
    },
    {
      q: 'Un nouveau collaborateur arrive. Ta priorité ?',
      a: [
        { t: 'Lui donner des objectifs précis et un cadre clair.', p: 'capitaine' },
        { t: 'Le former et lui transmettre les bonnes pratiques.', p: 'coach' },
        { t: "L'intégrer à l'équipe et créer du lien.", p: 'federateur' },
        { t: 'Lui confier rapidement une vraie responsabilité.', p: 'eclaireur' },
      ],
    },
    {
      q: 'Face à un changement imposé par la direction, tu…',
      a: [
        { t: 'Le mets en œuvre rapidement avec un plan clair.', p: 'capitaine' },
        { t: 'Prends le temps de convaincre l\'équipe de son intérêt.', p: 'coach' },
        { t: 'Recueilles les craintes et les idées de chacun.', p: 'federateur' },
        { t: "Laisses l'équipe trouver comment l'appliquer.", p: 'eclaireur' },
      ],
    },
    {
      q: 'Ton agenda idéal contient surtout…',
      a: [
        { t: 'Des points de suivi et de pilotage.', p: 'capitaine' },
        { t: 'Des moments de formation et de transmission.', p: 'coach' },
        { t: 'Des échanges individuels et collectifs.', p: 'federateur' },
        { t: 'Du temps pour la réflexion stratégique.', p: 'eclaireur' },
      ],
    },
    {
      q: 'Ce qui t\'agace le plus chez un collaborateur :',
      a: [
        { t: 'Le manque de rigueur.', p: 'capitaine' },
        { t: 'Le manque de curiosité.', p: 'coach' },
        { t: "Le manque d'esprit d'équipe.", p: 'federateur' },
        { t: "Le manque d'initiative.", p: 'eclaireur' },
      ],
    },
  ],

  /* ---------- Les 4 fiches ---------- */
  // Chaque fiche contient un piège (et son antidote) propre à chaque profil.
  fiches: [
    {
      id: 'deleguer',
      emoji: '📦',
      title: 'Déléguer une mission',
      summary: 'Confier une mission sans la reprendre, et sans laisser ton collaborateur seul.',
      when: 'Tu es débordé(e), un collaborateur est prêt à monter en compétence, ou une tâche ne nécessite plus ton intervention.',
      steps: [
        { t: 'Choisir la bonne personne', d: "Évalue sa compétence ET sa motivation sur cette mission précise, pas en général." },
        { t: 'Présenter le pourquoi', d: "Explique l'enjeu de la mission et en quoi elle est une opportunité pour lui ou elle." },
        { t: 'Définir le résultat attendu', d: 'Précise le livrable, l\'échéance et les limites (budget, décisions autorisées).' },
        { t: 'Laisser le choix du comment', d: "Demande comment il ou elle compte s'y prendre plutôt que d'imposer ta méthode." },
        { t: 'Fixer les points de suivi', d: 'Mets dans l\'agenda des points d\'étape, adaptés au niveau d\'autonomie.' },
      ],
      phrases: [
        "« Je te confie cette mission parce que… »",
        "« Pour toi, à quoi ressemblerait un résultat réussi ? »",
        "« Qu'est-ce dont tu as besoin de ma part ? »",
      ],
      traps: {
        capitaine: { trap: 'Déléguer la tâche… mais garder le contrôle sur chaque détail, et reprendre la main au premier écart.', antidote: 'Définis le résultat attendu, pas la méthode. Pas d\'intervention entre deux points de suivi, sauf alerte.' },
        coach: { trap: 'Transformer la délégation en formation de 45 minutes : tu expliques tout, ton collaborateur n\'a plus rien à chercher.', antidote: 'Explique le pourquoi, puis demande : « Comment t\'y prendrais-tu ? » et écoute la réponse en entier.' },
        federateur: { trap: 'Ne pas oser déléguer une mission ingrate de peur de surcharger ou de déplaire.', antidote: 'Déléguer, c\'est faire confiance. Présente la mission honnêtement, avec ses contraintes, et laisse la personne se positionner.' },
        eclaireur: { trap: 'Déléguer en une phrase dans le couloir, puis disparaître jusqu\'à l\'échéance.', antidote: 'Formalise la mission en 3 lignes (résultat, échéance, limites) et cale le premier point de suivi tout de suite.' },
      },
    },
    {
      id: 'recadrer',
      emoji: '🎯',
      title: 'Recadrer un collaborateur',
      summary: 'Traiter un comportement ou un résultat qui ne convient pas, sans abîmer la relation.',
      when: 'Un engagement n\'est pas tenu, un comportement pose problème, ou une règle de l\'équipe n\'est pas respectée.',
      steps: [
        { t: 'Agir vite et en privé', d: 'Le recadrage perd son sens s\'il arrive trois semaines après. Jamais devant l\'équipe.' },
        { t: 'Décrire les faits', d: 'Des faits observables, datés, sans jugement : « Mardi, le rapport est arrivé à 18 h au lieu de 12 h. »' },
        { t: 'Exprimer l\'impact', d: 'Explique les conséquences concrètes pour l\'équipe, le client ou toi.' },
        { t: 'Écouter sa version', d: 'Demande son point de vue et cherche à comprendre, sans excuser.' },
        { t: 'Obtenir un engagement', d: 'Fais formuler par la personne ce qu\'elle va changer, et fixe un point de vérification.' },
      ],
      phrases: [
        "« J'ai besoin qu'on parle de… »",
        "« Voilà ce que j'ai observé… et voilà l'impact. »",
        "« Qu'est-ce que tu proposes pour que ça ne se reproduise pas ? »",
      ],
      traps: {
        capitaine: { trap: 'Recadrer trop fort, sur le ton de la sanction, et sans écouter : tu obtiens l\'obéissance, pas l\'engagement.', antidote: 'Après les faits et l\'impact, pose une question et tais-toi. Laisse la personne s\'expliquer.' },
        coach: { trap: 'Noyer le message dans une leçon : le recadrage devient un cours et la personne ne retient pas que c\'est sérieux.', antidote: 'Commence par une phrase claire : « Ce point n\'est pas acceptable. » Puis seulement, échange.' },
        federateur: { trap: 'Repousser le recadrage ou l\'enrober tellement que le message ne passe pas.', antidote: 'Prépare ta première phrase mot pour mot et dis-la dans les 30 premières secondes de l\'échange.' },
        eclaireur: { trap: 'Attendre que la personne s\'en rende compte seule… jusqu\'à ce que la situation dégénère.', antidote: 'L\'autonomie n\'exclut pas le cadre : dès le deuxième écart, provoque l\'échange.' },
      },
    },
    {
      id: 'motiver',
      emoji: '🔥',
      title: 'Remotiver un collaborateur',
      summary: 'Comprendre une baisse d\'engagement et aider la personne à retrouver de l\'élan.',
      when: 'Tu observes moins d\'énergie, moins d\'initiatives, plus de retards ou de retrait chez un collaborateur.',
      steps: [
        { t: 'Ouvrir un espace d\'échange', d: 'Un moment dédié, au calme, présenté comme un point d\'attention et non un reproche.' },
        { t: 'Partager ce que tu observes', d: 'Des faits, avec bienveillance : « J\'ai l\'impression que tu es moins dans le coup ces temps-ci. »' },
        { t: 'Explorer les causes', d: 'Sens du travail, reconnaissance, charge, relations, perspectives, vie personnelle : écoute sans chercher à réparer.' },
        { t: 'Co-construire un levier', d: 'Identifie ensemble une action concrète qui dépend de vous deux.' },
        { t: 'Suivre dans le temps', d: 'Reviens vers la personne sous 2 à 3 semaines pour mesurer le changement.' },
      ],
      phrases: [
        "« Qu'est-ce qui te donne de l'énergie dans ton travail ? Et qu'est-ce qui t'en prend ? »",
        "« Si tu avais une baguette magique, que changerais-tu ? »",
        "« Qu'est-ce que je peux faire, moi, pour t'aider ? »",
      ],
      traps: {
        capitaine: { trap: 'Remotiver par la pression ou par de nouveaux objectifs : tu traites le symptôme (la performance) et pas la cause.', antidote: 'Interdis-toi de parler objectifs pendant ce premier échange. Ton seul but : comprendre.' },
        coach: { trap: 'Faire un discours inspirant sur le sens du travail au lieu de découvrir ce qui démotive vraiment la personne.', antidote: 'Remplace chaque argument par une question. La motivation se trouve chez lui ou chez elle, pas dans ton discours.' },
        federateur: { trap: 'Trop compatir et absorber le problème : tu écoutes beaucoup, mais rien ne change concrètement.', antidote: 'Termine toujours par : « Qu\'est-ce qu\'on décide concrètement d\'ici notre prochain point ? »' },
        eclaireur: { trap: 'Ne pas voir la baisse de motivation, faute de proximité, ou la considérer comme « son affaire ».', antidote: 'Instaure un one-to-one régulier de 20 minutes, même quand tout semble aller bien.' },
      },
    },
    {
      id: 'conflit',
      emoji: '⚡',
      title: 'Gérer un conflit dans l\'équipe',
      summary: 'Désamorcer une tension entre collaborateurs avant qu\'elle n\'abîme le collectif.',
      when: 'Des tensions entre deux personnes (ou plus) perturbent le travail ou l\'ambiance de l\'équipe.',
      steps: [
        { t: 'Ne pas laisser s\'installer', d: 'Un conflit ignoré grossit. Intervenir tôt, c\'est intervenir moins fort.' },
        { t: 'Écouter chacun séparément', d: 'Comprends les faits, les ressentis et les besoins de chaque partie, sans prendre parti.' },
        { t: 'Réunir les personnes', d: 'Pose les règles : respect, faits, chacun parle à son tour. Tu es garant du cadre.' },
        { t: 'Faire émerger un accord', d: 'Cherche ce qui compte pour chacun et construisez ensemble des engagements concrets.' },
        { t: 'Suivre l\'accord', d: 'Fixe un point de suivi et reconnais les efforts de chacun.' },
      ],
      phrases: [
        "« Mon rôle n'est pas de dire qui a raison, mais de vous aider à retravailler ensemble. »",
        "« Qu'est-ce qui est important pour toi dans cette situation ? »",
        "« Concrètement, qu'est-ce que chacun s'engage à faire ? »",
      ],
      traps: {
        capitaine: { trap: 'Trancher immédiatement en désignant qui a raison : le conflit s\'éteint en surface mais la rancœur reste.', antidote: 'Avant toute décision, fais reformuler à chacun le point de vue de l\'autre.' },
        coach: { trap: 'Faire la morale aux deux parties sur l\'importance de la coopération.', antidote: 'Tu es médiateur, pas professeur : pose des questions, ne donne pas de leçon.' },
        federateur: { trap: 'Minimiser le conflit pour préserver l\'ambiance, ou rester trop neutre pour poser un cadre.', antidote: 'Nomme la tension clairement : « Il y a un désaccord entre vous et il impacte l\'équipe. »' },
        eclaireur: { trap: 'Laisser les adultes « régler ça entre eux » alors que la tension contamine déjà toute l\'équipe.', antidote: 'Dès que le conflit impacte le travail des autres, il devient ton sujet. Interviens.' },
      },
    },
  ],

  /* ---------- Débrief ---------- */
  debriefOutcomes: [
    { v: 'reussi', label: 'Ça s\'est bien passé', emoji: '😀' },
    { v: 'mitige', label: 'Mitigé', emoji: '😐' },
    { v: 'difficile', label: 'Difficile', emoji: '😟' },
  ],
  debriefTrapAnswers: [
    { v: 'non', label: 'Non, je l\'ai évité' },
    { v: 'partiel', label: 'En partie' },
    { v: 'oui', label: 'Oui, je suis tombé(e) dedans' },
  ],
};
