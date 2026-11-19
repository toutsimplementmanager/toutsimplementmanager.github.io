/* Copilote Manager — interface et parcours */
(function () {
  const C = window.CONTENT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const view = $('#view');

  // ---------- Utilitaires ----------
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const fiche = (id) => C.fiches.find((f) => f.id === id);
  const profileOf = (key) => C.profiles[key];
  const go = (route) => { location.hash = '#/' + route; };

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  function confirmModal(title, text, okLabel, onOk) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = `<p class="muted">${esc(text)}</p>`;
    $('#modalOk').textContent = okLabel;
    $('#modalForm').onsubmit = (e) => { if (e.submitter && e.submitter.value === 'ok') onOk(); };
    $('#modal').showModal();
  }

  function coachingLink(user) {
    const p = profileOf(Store.profile(user));
    try {
      const url = new URL(C.config.coachingUrl);
      if (p) url.searchParams.set('profil', p.name);
      url.searchParams.set('utm_source', 'copilote-manager');
      return url.toString();
    } catch (e) { return C.config.coachingUrl || '#'; }
  }

  const goFurtherBanner = () => `
    <div class="cta-banner section">
      <div><h3 style="margin:0">Envie d'aller plus loin ?</h3><p>Travaille tes situations réelles en ${esc(C.config.coachingTitle.toLowerCase())}.</p></div>
      <a href="#/accompagnement" class="btn accent">Aller plus loin →</a>
    </div>`;

  // ---------- Vues publiques ----------
  const views = {};

  views.accueil = () => `
    <section class="hero">
      <img src="icon.svg" alt="" class="logo">
      <div class="eyebrow">${esc(C.config.appName)}</div>
      <h1>Quel manager es-tu vraiment&nbsp;?</h1>
      <p class="lead">${esc(C.config.tagline)}</p>
      <div class="actions" style="justify-content:center">
        <a href="#/inscription" class="btn primary">Commencer le quiz — c'est gratuit</a>
        <a href="#/connexion" class="btn ghost">J'ai déjà un compte</a>
      </div>
      <div class="steps-intro">
        <div class="card"><div class="num">🧭</div><h3>1. Ton profil</h3><p class="muted small">${C.quiz.length} questions pour découvrir ton style de management parmi ${Object.keys(C.profiles).length} profils.</p></div>
        <div class="card"><div class="num">📚</div><h3>2. Tes ${C.fiches.length} fiches</h3><p class="muted small">Les situations qui font peur aux nouveaux managers, avec une trame et LE piège qui te guette selon ton profil.</p></div>
        <div class="card"><div class="num">🗂️</div><h3>3. Tes débriefs</h3><p class="muted small">Après chaque échange, un débrief de 2 minutes sauvegardé dans ton historique.</p></div>
      </div>
    </section>`;

  views.inscription = () => `
    <div class="auth">
      <a href="#/" class="back">← Retour</a>
      <div class="card">
        <h2>Crée ton compte</h2>
        <p class="muted small">Pour sauvegarder ton profil et tes débriefs.</p>
        <form id="signupForm" novalidate>
          <label for="firstName">Prénom</label>
          <input id="firstName" name="firstName" autocomplete="given-name" required>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required>
          <label for="password">Mot de passe <span class="muted">(6 caractères minimum)</span></label>
          <input id="password" name="password" type="password" autocomplete="new-password" minlength="6" required>
          <label class="check"><input type="checkbox" name="consent"> J'accepte de recevoir des conseils de management et des informations sur l'accompagnement 1:1. Désinscription possible à tout moment.</label>
          <p class="small muted" style="margin:10px 0 0">${esc(C.config.privacyNotice)} <a href="#/confidentialite">En savoir plus</a></p>
          <div class="error" id="formError"></div>
          <button class="btn primary block" style="margin-top:8px">Créer mon compte et lancer le quiz</button>
        </form>
      </div>
      <p class="center small muted" style="margin-top:16px">Déjà inscrit(e) ? <a href="#/connexion">Se connecter</a></p>
    </div>`;

  views.connexion = () => `
    <div class="auth">
      <a href="#/" class="back">← Retour</a>
      <div class="card">
        <h2>Content de te revoir 👋</h2>
        <form id="loginForm" novalidate>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required>
          <label for="password">Mot de passe</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required>
          <div class="error" id="formError"></div>
          <button class="btn primary block" style="margin-top:8px">Se connecter</button>
        </form>
      </div>
      <p class="center small muted" style="margin-top:16px">Pas encore de compte ? <a href="#/inscription">S'inscrire</a></p>
    </div>`;

  // ---------- Quiz ----------
  let quiz = null;
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  function startQuiz() {
    quiz = { i: 0, answers: [], orders: C.quiz.map((q) => shuffle(q.a.map((_, k) => k))) };
  }

  views.quiz = (user) => {
    if (!quiz) startQuiz();
    const q = C.quiz[quiz.i];
    const pct = Math.round((quiz.i / C.quiz.length) * 100);
    return `
      <div style="max-width:620px;margin:0 auto">
        ${quiz.i === 0 && !Store.profile(user) ? `<p class="muted">Bienvenue ${esc(user.firstName)} ! Réponds spontanément : il n'y a pas de bonne ou de mauvaise réponse.</p>` : ''}
        <div class="eyebrow">Question ${quiz.i + 1} / ${C.quiz.length}</div>
        <div class="quiz-progress"><div style="width:${pct}%"></div></div>
        <h2>${esc(q.q)}</h2>
        <div class="answers section" style="margin-top:20px">
          ${quiz.orders[quiz.i].map((k) => `<button class="answer ${quiz.answers[quiz.i] === k ? 'selected' : ''}" data-answer="${k}">${esc(q.a[k].t)}</button>`).join('')}
        </div>
        <div class="actions">
          ${quiz.i > 0 ? '<button class="btn ghost" data-act="quiz-back">← Question précédente</button>' : ''}
        </div>
      </div>`;
  };

  function answerQuiz(k) {
    quiz.answers[quiz.i] = k;
    $$('.answer').forEach((b) => b.classList.toggle('selected', Number(b.dataset.answer) === k));
    setTimeout(() => {
      if (quiz.i < C.quiz.length - 1) { quiz.i++; render(); return; }
      const scores = Object.fromEntries(Object.keys(C.profiles).map((p) => [p, 0]));
      quiz.answers.forEach((a, i) => { scores[C.quiz[i].a[a].p]++; });
      Store.saveResult(scores);
      quiz = null;
      go('resultat');
    }, 220);
  }

  // ---------- Résultat ----------
  views.resultat = (user) => {
    const result = user.results[user.results.length - 1];
    const p = profileOf(result.profile);
    const total = Object.values(result.scores).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(result.scores).sort((a, b) => b[1] - a[1]);
    return `
      <div class="card profile-hero" style="--pc:${p.color}">
        <div class="eyebrow">Ton profil managérial</div>
        <div class="profile-emoji">${p.emoji}</div>
        <h1 style="margin-top:10px">${esc(p.name)}</h1>
        <p class="muted" style="font-size:18px">${esc(p.short)}</p>
      </div>
      <div class="stack section">
        <div class="card"><p style="margin:0">${esc(p.description)}</p></div>
        <div class="card"><h3>💪 Tes forces</h3><div class="chips">${p.strengths.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>
        <div class="trap">
          <h3>⚠️ Ton piège principal</h3>
          <p style="margin:0">${esc(p.trap)}</p>
          <div class="antidote"><b>Antidote :</b> ${esc(p.antidote)}</div>
        </div>
        <div class="card">
          <h3>📊 Ton mix de styles</h3>
          <div class="bars">${sorted.map(([k, v]) => `
            <div class="bar-row"><span>${profileOf(k).emoji} ${esc(profileOf(k).name)}</span>
            <div class="bar"><div style="width:${Math.round((v / total) * 100)}%;background:${profileOf(k).color}"></div></div>
            <b>${Math.round((v / total) * 100)}%</b></div>`).join('')}
          </div>
          ${user.results.length > 1 ? `<p class="small muted" style="margin:14px 0 0">Quiz réalisé ${user.results.length} fois. Précédent résultat : ${esc(profileOf(user.results[user.results.length - 2].profile).name)} (${fmtDate(user.results[user.results.length - 2].date)}).</p>` : ''}
        </div>
      </div>
      <div class="actions">
        <a href="#/fiches" class="btn primary">Découvrir mes ${C.fiches.length} fiches →</a>
        <button class="btn ghost" data-act="retake">Refaire le quiz</button>
      </div>
      ${goFurtherBanner()}`;
  };

  // ---------- Fiches ----------
  views.fiches = (user) => {
    const pk = Store.profile(user);
    const p = profileOf(pk);
    return `
      <div class="eyebrow">Bonjour ${esc(user.firstName)}</div>
      <h1>Tes ${C.fiches.length} fiches</h1>
      <p class="muted">Profil <b style="color:${p.color}">${p.emoji} ${esc(p.name)}</b> : chaque fiche te montre le piège qui te concerne.</p>
      <div class="grid2 section">
        ${C.fiches.map((f, i) => {
          const n = user.debriefs.filter((d) => d.ficheId === f.id).length;
          return `<a class="card fiche-card" href="#/fiche/${f.id}">
            <span class="emoji">${f.emoji}</span>
            <div class="eyebrow" style="margin:4px 0 0">Fiche ${i + 1}</div>
            <h3 style="margin:0">${esc(f.title)}</h3>
            <p class="muted small" style="margin:0">${esc(f.summary)}</p>
            <div>${n ? `<span class="badge ok">${n} débrief${n > 1 ? 's' : ''}</span>` : '<span class="badge">À expérimenter</span>'}</div>
            <div class="trap-hint">⚠️ Ton piège : ${esc(f.traps[pk])}</div>
          </a>`;
        }).join('')}
      </div>
      ${goFurtherBanner()}`;
  };

  views.fiche = (user, id) => {
    const f = fiche(id);
    if (!f) return '<div class="card empty">Fiche introuvable.</div>';
    const pk = Store.profile(user);
    const p = profileOf(pk);
    const others = Object.keys(C.profiles).filter((k) => k !== pk);
    return `
      <a href="#/fiches" class="back">← Mes fiches</a>
      <div class="eyebrow">Fiche ${C.fiches.indexOf(f) + 1} / ${C.fiches.length}</div>
      <h1>${f.emoji} ${esc(f.title)}</h1>
      <p class="duration">⏱️ ${esc(f.duration)}</p>
      <div class="stack section">
        <div class="card"><h3><span class="num-title">1</span> Les 3 questions de cadrage</h3>
          <ul class="framing">${f.framing.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
        </div>
        <div class="card"><h3><span class="num-title">2</span> La trame</h3>
          <ol class="method">${f.steps.map((s) => `<li><div><b>${esc(s.t)}</b><div class="quote">${esc(s.d)}</div></div></li>`).join('')}</ol>
        </div>
        <div class="card"><h3><span class="num-title">3</span> Les réactions probables</h3>
          <div class="reactions">${f.reactions.map((r) => `<div class="reaction"><div class="r-them">${esc(r.r)}</div><div class="r-you">→ ${esc(r.a)}</div></div>`).join('')}</div>
        </div>
        <div class="trap">
          <h3><span class="num-title danger">4</span> Le piège selon ton profil</h3>
          <div class="eyebrow" style="color:var(--danger)">${p.emoji} Profil ${esc(p.name)}</div>
          <p style="margin:0;font-size:18px;font-weight:600">${esc(f.traps[pk])}</p>
          <details style="margin-top:14px"><summary class="small"><b>Voir les pièges des autres profils</b></summary>
            ${others.map((k) => `<p class="small" style="margin:10px 0 0"><b>${profileOf(k).emoji} ${esc(profileOf(k).name)} :</b> ${esc(f.traps[k])}</p>`).join('')}
          </details>
        </div>
        <div class="card"><h3><span class="num-title">5</span> Le débrief de 2 minutes</h3>
          <ul class="framing">${f.debrief.map((q) => `<li>${esc(q)}</li>`).join('')}<li>${esc(C.debriefLastQuestion)} : ___</li></ul>
          <p class="small muted" style="margin:12px 0 0">Après l'échange, fais ton débrief : il sera sauvegardé dans ton historique.</p>
        </div>
      </div>
      <div class="actions">
        <a href="#/debrief/${f.id}" class="btn primary">Faire mon débrief</a>
        <a href="#/accompagnement" class="btn accent">Aller plus loin</a>
      </div>`;
  };

  // ---------- Débrief ----------
  const debriefQuestions = (f) => f.debrief.map((q, i) => `
    <label>${esc(q)}</label>
    <div class="choice-row">${C.debriefAnswers.map((o, k) => `<label><input type="radio" name="q${i}" value="${o.v}" ${k === 0 ? 'required' : ''}><span>${esc(o.label)}</span></label>`).join('')}</div>`).join('');

  views.debrief = (user, ficheId) => {
    const f = fiche(ficheId) || C.fiches[0];
    const pk = Store.profile(user);
    return `
      <a href="#/fiche/${f.id}" class="back">← Retour à la fiche</a>
      <h1>Le débrief de 2 minutes</h1>
      <p class="muted">C'est là que se construisent les nouveaux réflexes.</p>
      <form id="debriefForm" class="card section" novalidate>
        <div class="grid2" style="gap:0 16px">
          <div><label for="ficheId">Fiche</label><select id="ficheId" name="ficheId">${C.fiches.map((x) => `<option value="${x.id}" ${x.id === f.id ? 'selected' : ''}>${x.emoji} ${esc(x.title)}</option>`).join('')}</select></div>
          <div><label for="date">Date de l'échange</label><input id="date" name="date" type="date" value="${todayISO()}" max="${todayISO()}" required></div>
        </div>
        <label for="situation">En une phrase, la situation <span class="muted">(facultatif)</span></label>
        <input id="situation" name="situation" placeholder="Ex. : recadrage de Paul sur ses retards">
        <div id="debriefQuestions">${debriefQuestions(f)}</div>
        <label for="different">${esc(C.debriefLastQuestion)}</label>
        <textarea id="different" name="different" required></textarea>
        <p class="small muted" id="trapReminder" style="margin:14px 0 0">⚠️ Ton piège sur cette fiche : ${esc(f.traps[pk])}</p>
        <div class="error" id="formError"></div>
        <div class="actions"><button class="btn primary">Enregistrer mon débrief</button></div>
      </form>`;
  };

  // ---------- Historique ----------
  const debriefScore = (d) => {
    const ans = d.answers || [];
    if (!ans.length) return null;
    return ans.reduce((s, v) => s + ((C.debriefAnswers.find((o) => o.v === v) || {}).score || 0), 0) / ans.length;
  };
  const scoreBadge = (d) => {
    const s = debriefScore(d);
    if (s === null) return '';
    const yes = (d.answers || []).filter((v) => v === 'oui').length;
    return `<span class="badge ${s >= 0.99 ? 'ok' : s >= 0.5 ? 'warn' : 'danger'}">${yes}/${d.answers.length} oui</span>`;
  };

  let historyFilter = '';
  views.historique = (user, id) => {
    if (id) return historyDetail(user, id);
    const all = [...user.debriefs].sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt));
    const list = historyFilter ? all.filter((d) => d.ficheId === historyFilter) : all;
    const scores = all.map(debriefScore).filter((s) => s !== null);
    const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) + ' %' : '—';
    const tried = new Set(all.map((d) => d.ficheId)).size;
    return `
      <h1>Mon historique</h1>
      <p class="muted">Tous tes débriefs, pour mesurer tes progrès.</p>
      <div class="stats section">
        <div class="card stat"><b>${all.length}</b><span class="small muted">débrief${all.length > 1 ? 's' : ''}</span></div>
        <div class="card stat"><b>${tried} / ${C.fiches.length}</b><span class="small muted">fiches pratiquées</span></div>
        <div class="card stat"><b>${avg}</b><span class="small muted">de réponses « oui »</span></div>
      </div>
      <div class="section">
        <div class="filters">
          <button class="${historyFilter ? '' : 'active'}" data-filter="">Toutes</button>
          ${C.fiches.map((f) => `<button class="${historyFilter === f.id ? 'active' : ''}" data-filter="${f.id}">${f.emoji} ${esc(f.title)}</button>`).join('')}
        </div>
        ${list.length ? `<div class="card" style="padding:6px 18px"><ul class="list">${list.map((d) => {
          const f = fiche(d.ficheId) || {};
          return `<li><a href="#/historique/${d.id}">
            <span class="ico">${f.emoji || '📝'}</span>
            <div class="grow"><b>${esc(f.title || 'Fiche')}</b>
            ${d.situation ? `<div class="small muted ellipsis">${esc(d.situation)}</div>` : ''}
            <div class="small muted">${fmtDate(d.date)}</div></div>
            ${scoreBadge(d)}
          </a></li>`;
        }).join('')}</ul></div>` : `<div class="card empty">${all.length ? 'Aucun débrief pour cette fiche.' : "Aucun débrief pour l'instant.<br>Choisis une fiche, mets-la en pratique, puis reviens faire ton débrief."}<div class="actions" style="justify-content:center"><a href="#/fiches" class="btn primary">Voir mes fiches</a></div></div>`}
      </div>
      ${goFurtherBanner()}`;
  };

  function historyDetail(user, id) {
    const d = user.debriefs.find((x) => x.id === id);
    if (!d) return '<a href="#/historique" class="back">← Historique</a><div class="card empty">Débrief introuvable.</div>';
    const f = fiche(d.ficheId);
    const p = profileOf(d.profile);
    const label = (v) => (C.debriefAnswers.find((o) => o.v === v) || {}).label || '—';
    const cls = (v) => ({ oui: 'ok', partiel: 'warn', non: 'danger' }[v] || '');
    return `
      <a href="#/historique" class="back">← Historique</a>
      <div class="eyebrow">Débrief du ${fmtDate(d.date)}</div>
      <h1>${f ? f.emoji + ' ' + esc(f.title) : 'Débrief'}</h1>
      <div class="chips">${scoreBadge(d)}${p ? `<span class="chip">${p.emoji} ${esc(p.name)}</span>` : ''}</div>
      <div class="card section">
        ${d.situation ? `<p><b>La situation :</b> ${esc(d.situation)}</p>` : ''}
        ${f ? `<ul class="answers-list">${f.debrief.map((q, i) => `<li><span>${esc(q)}</span><span class="badge ${cls((d.answers || [])[i])}">${esc(label((d.answers || [])[i]))}</span></li>`).join('')}</ul>` : ''}
        ${d.different ? `<dl class="debrief" style="margin:0"><dt>${esc(C.debriefLastQuestion)}</dt><dd>${esc(d.different)}</dd></dl>` : ''}
      </div>
      ${f && d.profile && f.traps[d.profile] ? `<div class="trap section"><h3>⚠️ Ton piège à surveiller</h3><p style="margin:0">${esc(f.traps[d.profile])}</p></div>` : ''}
      <div class="actions">
        ${f ? `<a href="#/fiche/${f.id}" class="btn">Revoir la fiche</a>` : ''}
        <button class="btn ghost danger" data-act="delete-debrief" data-id="${d.id}">Supprimer</button>
      </div>
      ${goFurtherBanner()}`;
  }

  // ---------- Accompagnement 1:1 ----------
  views.accompagnement = (user) => {
    const pk = Store.profile(user);
    const p = profileOf(pk);
    const fell = user.debriefs.filter((d) => (d.answers || []).some((v) => v !== 'oui')).length;
    return `
      <div class="card profile-hero" style="--pc:var(--accent)">
        <div class="eyebrow">Aller plus loin</div>
        <h1>${esc(C.config.coachingTitle)}</h1>
        <p class="muted" style="font-size:18px;max-width:560px;margin:0 auto">${esc(C.config.coachingPitch)}</p>
      </div>
      <div class="stack section">
        <div class="card">
          <h3>${p.emoji} Pour toi, ${esc(user.firstName)}, profil ${esc(p.name)}</h3>
          <p>Ton piège principal : <b>${esc(p.trap.split(':')[0])}</b>.</p>
          ${user.debriefs.length ? `<p class="muted" style="margin:0">Tu as réalisé ${user.debriefs.length} débrief${user.debriefs.length > 1 ? 's' : ''}${fell ? `, dont ${fell} avec des points à travailler` : ''}. On peut s'appuyer dessus dès la première séance.</p>` : '<p class="muted" style="margin:0">Pas besoin d\'avoir fait de débrief : on part de ta réalité.</p>'}
        </div>
        <div class="card"><h3>Au programme</h3><ul style="margin:0;padding-left:20px">${C.config.coachingBullets.map((b) => `<li style="margin-bottom:6px">${esc(b)}</li>`).join('')}</ul></div>
      </div>
      <div class="actions" style="justify-content:center">
        <a href="${esc(coachingLink(user))}" target="_blank" rel="noopener" class="btn accent" style="font-size:18px;padding:16px 28px">${esc(C.config.coachingCta)} →</a>
      </div>`;
  };

  // ---------- Pages légales ----------
  const legalBack = (user) => `<a href="${user ? '#/fiches' : '#/'}" class="back">← Retour</a>`;
  views['mentions-legales'] = (user) => legalBack(user) + LEGAL_PAGES.mentions(LEGAL);
  views.confidentialite = (user) => legalBack(user) + LEGAL_PAGES.confidentialite(LEGAL);

  // ---------- Compte ----------
  views.compte = (user) => `
    <h1>Mon compte</h1>
    <div class="card section">
      <dl class="debrief" style="margin:0">
        <dt>Prénom</dt><dd>${esc(user.firstName)}</dd>
        <dt>Email</dt><dd>${esc(user.email)}</dd>
        <dt>Inscrit(e) depuis le</dt><dd>${fmtDate(user.createdAt)}</dd>
      </dl>
    </div>
    <p class="small muted section">Tes données sont enregistrées sur cet appareil, dans ton navigateur.</p>
    <div class="actions">
      <button class="btn" data-act="export">Télécharger mes données</button>
      <button class="btn" data-act="logout">Se déconnecter</button>
      <button class="btn ghost danger" data-act="delete-account">Supprimer mon compte</button>
    </div>`;

  // ---------- Routeur ----------
  const PUBLIC = ['accueil', 'inscription', 'connexion'];
  const OPEN = ['mentions-legales', 'confidentialite'];
  const NEEDS_PROFILE = ['resultat', 'fiches', 'fiche', 'debrief', 'accompagnement'];
  const TITLES = { accueil: 'Bienvenue', inscription: 'Inscription', connexion: 'Connexion', quiz: 'Quiz', resultat: 'Mon profil', fiches: 'Mes fiches', fiche: 'Fiche', debrief: 'Débrief', historique: 'Historique', accompagnement: 'Aller plus loin', compte: 'Compte', 'mentions-legales': 'Mentions légales', confidentialite: 'Confidentialité' };

  function render() {
    let [route, arg] = location.hash.replace(/^#\/?/, '').split('/');
    route = route || 'accueil';
    if (!views[route]) route = 'accueil';
    const user = Store.current();

    if (!user && !PUBLIC.includes(route) && !OPEN.includes(route)) return go('');
    if (user && PUBLIC.includes(route)) return go(Store.profile(user) ? 'fiches' : 'quiz');
    if (user && !Store.profile(user) && NEEDS_PROFILE.includes(route)) return go('quiz');

    const loggedIn = !!user && route !== 'quiz';
    $('#topbar').hidden = !user;
    $('#tabbar').hidden = !loggedIn;
    $$('#nav a, #tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.route === route || (route === 'fiche' && a.dataset.route === 'fiches') || (route === 'debrief' && a.dataset.route === 'historique')));

    document.title = `${TITLES[route]} · ${C.config.appName}`;
    view.innerHTML = views[route](user, arg);
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
  }

  // ---------- Formulaires ----------
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!['signupForm', 'loginForm', 'debriefForm'].includes(form.id)) return;
    e.preventDefault();
    const err = $('#formError', form);
    const data = Object.fromEntries(new FormData(form).entries());
    err.textContent = '';
    try {
      if (form.id === 'signupForm') {
        if (!data.firstName.trim()) throw new Error('Indique ton prénom.');
        if (!/^\S+@\S+\.\S+$/.test(data.email)) throw new Error('Adresse email invalide.');
        if ((data.password || '').length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
        await Store.signup(data);
        quiz = null;
        go('quiz');
      } else if (form.id === 'loginForm') {
        await Store.login(data.email, data.password);
        render();
      } else {
        const f = fiche(data.ficheId);
        const answers = f.debrief.map((_, i) => data['q' + i]);
        if (answers.some((v) => !v)) throw new Error('Réponds aux ' + f.debrief.length + ' questions du débrief.');
        if (!data.different.trim()) throw new Error('Note ce que tu feras différemment la prochaine fois.');
        const d = Store.saveDebrief({ ficheId: f.id, date: data.date, situation: data.situation.trim(), answers, different: data.different.trim() });
        toast('Débrief enregistré dans ton historique ✅');
        go('historique/' + d.id);
      }
    } catch (ex) {
      err.textContent = ex.message;
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'ficheId') {
      const f = fiche(e.target.value);
      $('#debriefQuestions').innerHTML = debriefQuestions(f);
      $('#trapReminder').textContent = '⚠️ Ton piège sur cette fiche : ' + f.traps[Store.profile()];
    }
  });

  // ---------- Actions ----------
  document.addEventListener('click', (e) => {
    const ans = e.target.closest('[data-answer]');
    if (ans) return answerQuiz(Number(ans.dataset.answer));
    const filter = e.target.closest('[data-filter]');
    if (filter) { historyFilter = filter.dataset.filter; return render(); }
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'quiz-back') { quiz.i--; render(); }
    if (act === 'retake') confirmModal('Refaire le quiz ?', 'Ton nouveau résultat deviendra ton profil actuel. Tes débriefs sont conservés.', 'Refaire le quiz', () => { quiz = null; go('quiz'); });
    if (act === 'delete-debrief') confirmModal('Supprimer ce débrief ?', 'Cette action est définitive.', 'Supprimer', () => { Store.deleteDebrief(el.dataset.id); toast('Débrief supprimé'); go('historique'); });
    if (act === 'logout') { Store.logout(); go(''); }
    if (act === 'delete-account') confirmModal('Supprimer ton compte ?', `Ton profil et tous tes débriefs seront définitivement supprimés de cet appareil. Pour être aussi retiré(e) de la liste des inscrits, écris à ${LEGAL.email}.`, 'Supprimer mon compte', () => { Store.deleteAccount(); go(''); toast('Compte supprimé'); });
    if (act === 'export') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([Store.exportUser()], { type: 'application/json' }));
      a.download = 'copilote-manager-mes-donnees.json';
      a.click();
      URL.revokeObjectURL(a.href);
    }
  });

  window.addEventListener('hashchange', render);
  render();
})();
