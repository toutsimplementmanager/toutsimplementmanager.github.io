/* Copilote Manager — stockage local (localStorage) */
(function () {
  const KEY = 'copilote-manager:v1';

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const today = () => new Date().toISOString().slice(0, 10);
  const addDays = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  function emptyState() {
    return { version: 1, members: [], meetings: [], tasks: [], goals: [], feedbacks: [] };
  }

  function demoState() {
    const s = emptyState();
    const alice = { id: uid(), name: 'Alice Martin', role: 'Développeuse senior', email: '', startDate: '2022-03-01', color: '#4f46e5', notes: 'Souhaite évoluer vers un rôle de lead technique.', oneOnOneEvery: 14 };
    const karim = { id: uid(), name: 'Karim Benali', role: 'Product designer', email: '', startDate: '2023-09-15', color: '#0891b2', notes: 'Très investi sur la refonte de l\'onboarding.', oneOnOneEvery: 14 };
    const lea = { id: uid(), name: 'Léa Dubois', role: 'Développeuse junior', email: '', startDate: addDays(-40), color: '#db2777', notes: 'Arrivée récente — suivre l\'intégration de près.', oneOnOneEvery: 7 };
    s.members.push(alice, karim, lea);

    s.meetings.push(
      { id: uid(), memberId: alice.id, date: addDays(-20), mood: 4, notes: 'Bonne dynamique sur le projet API. Intéressée par du mentoring.', actions: 'Lui confier le mentoring de Léa', nextTopics: 'Plan de carrière lead' },
      { id: uid(), memberId: karim.id, date: addDays(-6), mood: 3, notes: 'Un peu de frustration sur les arbitrages produit.', actions: 'Clarifier la roadmap T1 avec le PM', nextTopics: 'Retour sur les arbitrages' },
      { id: uid(), memberId: lea.id, date: addDays(-9), mood: 2, notes: 'Se sent un peu perdue sur la base de code.', actions: 'Organiser une session de pair programming', nextTopics: 'Point sur la montée en compétence' }
    );

    s.tasks.push(
      { id: uid(), title: 'Préparer la revue de performance annuelle', memberId: '', due: addDays(5), status: 'todo', priority: 'high', description: '' },
      { id: uid(), title: 'Session pair programming avec Léa', memberId: alice.id, due: addDays(-1), status: 'doing', priority: 'medium', description: '' },
      { id: uid(), title: 'Clarifier la roadmap T1 avec le PM', memberId: karim.id, due: addDays(3), status: 'todo', priority: 'medium', description: '' },
      { id: uid(), title: 'Mettre à jour la documentation d\'onboarding', memberId: lea.id, due: addDays(10), status: 'done', priority: 'low', description: '' }
    );

    s.goals.push(
      { id: uid(), title: 'Réduire le temps d\'onboarding à 2 semaines', memberId: '', due: addDays(80), progress: 40, keyResults: 'Guide d\'onboarding complet\nBuddy assigné à chaque arrivée\nSatisfaction ≥ 4/5' },
      { id: uid(), title: 'Devenir référente technique API', memberId: alice.id, due: addDays(120), progress: 25, keyResults: 'Animer 2 ateliers internes\nRelire 80 % des PR API' }
    );

    s.feedbacks.push(
      { id: uid(), memberId: karim.id, date: addDays(-3), type: 'positive', text: 'Excellente présentation de la nouvelle maquette au comité.' },
      { id: uid(), memberId: lea.id, date: addDays(-12), type: 'constructive', text: 'Penser à poser ses questions plus tôt plutôt que rester bloquée.' }
    );
    return s;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(emptyState(), JSON.parse(raw));
    } catch (e) { /* stockage indisponible */ }
    return null;
  }

  let state = load();
  const firstRun = !state;
  if (!state) state = demoState();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignoré */ }
  }
  if (firstRun) save();

  const Store = {
    uid, today, addDays,
    get: () => state,
    save,
    collection(name) { return state[name]; },
    find(name, id) { return state[name].find((x) => x.id === id); },
    upsert(name, item) {
      if (!item.id) { item.id = uid(); state[name].push(item); }
      else {
        const i = state[name].findIndex((x) => x.id === item.id);
        if (i >= 0) state[name][i] = Object.assign(state[name][i], item); else state[name].push(item);
      }
      save();
      return item;
    },
    remove(name, id) {
      state[name] = state[name].filter((x) => x.id !== id);
      if (name === 'members') {
        ['meetings', 'feedbacks'].forEach((c) => { state[c] = state[c].filter((x) => x.memberId !== id); });
        ['tasks', 'goals'].forEach((c) => state[c].forEach((x) => { if (x.memberId === id) x.memberId = ''; }));
      }
      save();
    },
    exportJSON() { return JSON.stringify(state, null, 2); },
    importJSON(text) {
      const data = JSON.parse(text);
      if (!data || !Array.isArray(data.members)) throw new Error('Fichier invalide');
      state = Object.assign(emptyState(), data);
      save();
    },
    reset(withDemo) { state = withDemo ? demoState() : emptyState(); save(); },
  };

  window.Store = Store;
})();
