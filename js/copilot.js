/* Copilote Manager — moteur de recommandations (local, sans IA externe) */
(function () {
  const DAY = 86400000;
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY);

  function lastMeeting(state, memberId) {
    return state.meetings
      .filter((m) => m.memberId === memberId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  function lastFeedback(state, memberId) {
    return state.feedbacks
      .filter((f) => f.memberId === memberId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  /** Retourne une liste de suggestions triées par priorité. */
  function suggestions(state) {
    const today = Store.today();
    const out = [];
    const rank = { high: 0, medium: 1, low: 2 };

    state.members.forEach((m) => {
      const first = m.name.split(' ')[0];
      const every = Number(m.oneOnOneEvery) || 14;
      const last = lastMeeting(state, m.id);
      if (!last) {
        out.push({ level: 'high', icon: '🗓️', text: `Aucun one-to-one enregistré avec ${first}. Planifiez un premier échange.`, action: { label: 'Faire le 1:1', route: `meetings/new/${m.id}` } });
      } else {
        const since = daysBetween(last.date, today);
        if (since > every) {
          out.push({ level: since > every * 2 ? 'high' : 'medium', icon: '🗓️', text: `Dernier 1:1 avec ${first} il y a ${since} jours (rythme visé : ${every} j).`, action: { label: 'Préparer le 1:1', route: `member/${m.id}` } });
        }
        if (Number(last.mood) <= 2) {
          out.push({ level: 'high', icon: '🌧️', text: `${first} semblait en difficulté lors du dernier 1:1 (humeur ${last.mood}/5). Prenez des nouvelles.`, action: { label: 'Voir la fiche', route: `member/${m.id}` } });
        }
      }

      const fb = lastFeedback(state, m.id);
      const fbSince = fb ? daysBetween(fb.date, today) : Infinity;
      if (fbSince > 30) {
        out.push({ level: 'low', icon: '💬', text: fb ? `Pas de feedback donné à ${first} depuis ${fbSince} jours.` : `Vous n'avez encore noté aucun feedback pour ${first}.`, action: { label: 'Ajouter un feedback', route: `feedback/new/${m.id}` } });
      }

      const load = state.tasks.filter((t) => t.memberId === m.id && t.status !== 'done').length;
      if (load >= 5) {
        out.push({ level: 'medium', icon: '⚖️', text: `${first} a ${load} tâches en cours : risque de surcharge.`, action: { label: 'Voir les tâches', route: 'tasks' } });
      }

      if (m.startDate) {
        const tenure = daysBetween(m.startDate, today);
        if (tenure >= 0 && tenure <= 90) {
          out.push({ level: 'low', icon: '🌱', text: `${first} est en période d'intégration (${tenure} j). Gardez un rythme de suivi rapproché.`, action: null });
        }
        const md = m.startDate.slice(5);
        const anniv = new Date(today.slice(0, 4) + '-' + md);
        const diff = daysBetween(today, anniv.toISOString().slice(0, 10));
        if (tenure > 300 && diff >= 0 && diff <= 7) {
          out.push({ level: 'low', icon: '🎉', text: `L'ancienneté de ${first} fête bientôt un anniversaire (${md.split('-').reverse().join('/')}).`, action: null });
        }
      }
    });

    const overdue = state.tasks.filter((t) => t.status !== 'done' && t.due && t.due < today);
    if (overdue.length) {
      out.push({ level: 'high', icon: '⏰', text: `${overdue.length} tâche(s) en retard : ${overdue.slice(0, 3).map((t) => '« ' + t.title + ' »').join(', ')}${overdue.length > 3 ? '…' : ''}`, action: { label: 'Voir les tâches', route: 'tasks' } });
    }

    const soon = state.goals.filter((g) => g.due && Number(g.progress) < 70 && daysBetween(today, g.due) <= 30 && daysBetween(today, g.due) >= 0);
    soon.forEach((g) => out.push({ level: 'medium', icon: '🎯', text: `L'objectif « ${g.title} » arrive à échéance dans ${daysBetween(today, g.due)} j et n'est qu'à ${g.progress} %.`, action: { label: 'Voir les objectifs', route: 'goals' } }));

    if (!state.members.length) {
      out.push({ level: 'medium', icon: '👋', text: 'Commencez par ajouter les membres de votre équipe.', action: { label: 'Ajouter un membre', route: 'team/new' } });
    }

    return out.sort((a, b) => rank[a.level] - rank[b.level]);
  }

  /** Génère une trame de préparation de 1:1 pour un membre. */
  function prepareOneOnOne(state, memberId) {
    const m = Store.find('members', memberId);
    if (!m) return '';
    const last = lastMeeting(state, memberId);
    const tasks = state.tasks.filter((t) => t.memberId === memberId && t.status !== 'done');
    const goals = state.goals.filter((g) => g.memberId === memberId);
    const fbs = state.feedbacks.filter((f) => f.memberId === memberId).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    const first = m.name.split(' ')[0];
    const L = [];

    L.push(`One-to-one avec ${m.name} — ${new Date().toLocaleDateString('fr-FR')}`);
    L.push('');
    L.push('1. Météo personnelle');
    L.push(`   • Comment te sens-tu en ce moment, ${first} ?`);
    if (last && Number(last.mood) <= 2) L.push(`   • La dernière fois tu semblais en difficulté : qu'est-ce qui a changé depuis ?`);
    L.push('');
    if (last) {
      L.push(`2. Suivi du dernier échange (${new Date(last.date).toLocaleDateString('fr-FR')})`);
      if (last.actions) last.actions.split('\n').filter(Boolean).forEach((a) => L.push(`   • Action : ${a}`));
      if (last.nextTopics) last.nextTopics.split('\n').filter(Boolean).forEach((a) => L.push(`   • Sujet prévu : ${a}`));
      L.push('');
    }
    L.push('3. Travail en cours');
    if (tasks.length) tasks.forEach((t) => L.push(`   • ${t.title}${t.due ? ' (échéance ' + new Date(t.due).toLocaleDateString('fr-FR') + ')' : ''} — des blocages ?`));
    else L.push('   • Sur quoi travailles-tu en priorité ? Des blocages ?');
    L.push('');
    if (goals.length) {
      L.push('4. Objectifs');
      goals.forEach((g) => L.push(`   • ${g.title} — ${g.progress} % : où en es-tu ?`));
      L.push('');
    }
    if (fbs.length) {
      L.push('5. Feedbacks récents à évoquer');
      fbs.forEach((f) => L.push(`   • [${f.type === 'positive' ? 'positif' : 'constructif'}] ${f.text}`));
      L.push('');
    }
    L.push('6. Développement');
    L.push('   • Qu\'aimerais-tu apprendre ou expérimenter dans les prochains mois ?');
    if (m.notes) L.push(`   • Rappel : ${m.notes}`);
    L.push('');
    L.push('7. Et moi, en tant que manager ?');
    L.push('   • Qu\'est-ce que je pourrais faire différemment pour t\'aider ?');
    return L.join('\n');
  }

  /** Aide à formuler un feedback selon la méthode SBI (Situation, Comportement, Impact). */
  function sbiTemplate(type) {
    return type === 'positive'
      ? 'Situation : lors de …\nComportement : tu as …\nImpact : cela a permis …\nMerci, continue comme ça !'
      : 'Situation : lors de …\nComportement : j\'ai observé que …\nImpact : cela a eu pour effet …\nProposition : la prochaine fois, que penses-tu de … ?';
  }

  window.Copilot = { suggestions, prepareOneOnOne, sbiTemplate, lastMeeting, daysBetween };
})();
