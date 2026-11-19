/* Copilote Manager — comptes et données (stockés dans le navigateur) */
(function () {
  const KEY = 'copilote-manager:v2';
  const SESSION = 'copilote-manager:session';

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { users: [] }; } catch (e) { return { users: [] }; }
  }
  let db = read();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* stockage indisponible */ }
  }

  async function hash(password, salt) {
    const data = new TextEncoder().encode(salt + ':' + password);
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 0; // repli si crypto.subtle est indisponible
    for (const b of data) h = (Math.imul(31, h) + b) | 0;
    return 'x' + h.toString(16);
  }

  const normEmail = (e) => String(e || '').trim().toLowerCase();

  function post(url, payload) {
    if (!url) return;
    try {
      fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }).catch(() => {});
    } catch (e) { /* ignoré */ }
  }

  const Store = {
    uid,

    current() {
      let id = null;
      try { id = localStorage.getItem(SESSION); } catch (e) { /* ignoré */ }
      return db.users.find((u) => u.id === id) || null;
    },

    async signup({ firstName, email, password, consent }) {
      email = normEmail(email);
      if (db.users.some((u) => u.email === email)) throw new Error('Un compte existe déjà avec cet email. Connecte-toi.');
      const salt = uid();
      const user = {
        id: uid(), firstName: firstName.trim(), email, salt,
        passHash: await hash(password, salt),
        consent: !!consent, createdAt: new Date().toISOString(),
        results: [], debriefs: [],
      };
      db.users.push(user);
      save();
      this.setSession(user.id);
      post(CONTENT.config.signupWebhook, { event: 'inscription', firstName: user.firstName, email, consent: user.consent, date: user.createdAt });
      return user;
    },

    async login(email, password) {
      const user = db.users.find((u) => u.email === normEmail(email));
      if (!user || (await hash(password, user.salt)) !== user.passHash) throw new Error('Email ou mot de passe incorrect.');
      this.setSession(user.id);
      return user;
    },

    setSession(id) { try { id ? localStorage.setItem(SESSION, id) : localStorage.removeItem(SESSION); } catch (e) { /* ignoré */ } },
    logout() { this.setSession(null); },

    /** Profil actuel = résultat de quiz le plus récent. */
    profile(user = this.current()) {
      const r = user && user.results[user.results.length - 1];
      return r ? r.profile : null;
    },

    saveResult(scores) {
      const user = this.current();
      // départage : en cas d'égalité, l'ordre des profils dans content.js fait foi
      const profile = Object.keys(CONTENT.profiles).reduce((best, p) => ((scores[p] || 0) > (scores[best] || 0) ? p : best));
      const result = { id: uid(), date: new Date().toISOString(), scores, profile };
      user.results.push(result);
      save();
      post(CONTENT.config.resultWebhook, { event: 'quiz', firstName: user.firstName, email: user.email, profile, profileName: CONTENT.profiles[profile].name, scores, date: result.date });
      return result;
    },

    saveDebrief(d) {
      const user = this.current();
      const debrief = { id: uid(), createdAt: new Date().toISOString(), profile: this.profile(user), ...d };
      user.debriefs.push(debrief);
      save();
      return debrief;
    },

    deleteDebrief(id) {
      const user = this.current();
      user.debriefs = user.debriefs.filter((d) => d.id !== id);
      save();
    },

    deleteAccount() {
      const user = this.current();
      db.users = db.users.filter((u) => u.id !== user.id);
      save();
      this.logout();
    },

    exportUser() {
      const { passHash, salt, ...rest } = this.current();
      return JSON.stringify(rest, null, 2);
    },
  };

  window.Store = Store;
})();
