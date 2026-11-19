/* Copilote Manager — interface */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const view = $('#view');
  const S = () => Store.get();

  // ---------- Utilitaires ----------
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (d) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
  const initials = (n) => n.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const memberName = (id) => (Store.find('members', id) || {}).name || 'Moi';
  const MOODS = ['', '😞', '😕', '😐', '🙂', '😄'];
  const COLORS = ['#4f46e5', '#0891b2', '#db2777', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#0d9488'];
  const PRIORITY = { high: ['Haute', 'danger'], medium: ['Moyenne', 'warn'], low: ['Basse', ''] };
  const STATUS = { todo: 'À faire', doing: 'En cours', done: 'Terminé' };
  let search = '';

  const avatar = (m, size = 40) => `<span class="avatar" style="background:${esc(m.color)};width:${size}px;height:${size}px;font-size:${size / 2.6}px">${esc(initials(m.name))}</span>`;
  const matches = (...fields) => !search || fields.join(' ').toLowerCase().includes(search);
  const memberOptions = (selected, allowEmpty = true) =>
    (allowEmpty ? `<option value="">Moi / non assigné</option>` : '') +
    S().members.map((m) => `<option value="${m.id}" ${m.id === selected ? 'selected' : ''}>${esc(m.name)}</option>`).join('');

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function dueBadge(t) {
    if (!t.due) return '';
    if (t.status === 'done') return `<span class="badge">${fmtDate(t.due)}</span>`;
    const d = Copilot.daysBetween(Store.today(), t.due);
    const cls = d < 0 ? 'danger' : d <= 2 ? 'warn' : '';
    const label = d < 0 ? `En retard (${-d} j)` : d === 0 ? "Aujourd'hui" : fmtDate(t.due);
    return `<span class="badge ${cls}">${label}</span>`;
  }

  // ---------- Modale générique ----------
  function openModal(title, bodyHTML, onSave, okLabel = 'Enregistrer') {
    const dlg = $('#modal');
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = bodyHTML;
    $('#modalOk').textContent = okLabel;
    $('#modalOk').hidden = !onSave;
    const form = $('#modalForm');
    form.onsubmit = (e) => {
      if (e.submitter && e.submitter.value === 'cancel') return;
      if (!onSave) return;
      const data = Object.fromEntries(new FormData(form).entries());
      if (onSave(data, form) === false) e.preventDefault();
      else render();
    };
    dlg.showModal();
    const first = $('input:not([type=hidden]),textarea,select', form);
    if (first) first.focus();
    return form;
  }

  // ---------- Formulaires ----------
  function memberForm(m = {}) {
    const color = m.color || COLORS[S().members.length % COLORS.length];
    openModal(m.id ? 'Modifier le membre' : 'Nouveau membre', `
      <label>Nom complet</label><input name="name" required value="${esc(m.name)}">
      <div class="row">
        <div><label>Poste</label><input name="role" value="${esc(m.role)}"></div>
        <div><label>Email</label><input name="email" type="email" value="${esc(m.email)}"></div>
      </div>
      <div class="row">
        <div><label>Date d'arrivée</label><input name="startDate" type="date" value="${esc(m.startDate)}"></div>
        <div><label>Rythme des 1:1 (jours)</label><input name="oneOnOneEvery" type="number" min="1" value="${esc(m.oneOnOneEvery || 14)}"></div>
        <div><label>Couleur</label><input name="color" type="color" value="${esc(color)}"></div>
      </div>
      <label>Notes (aspirations, contexte…)</label><textarea name="notes">${esc(m.notes)}</textarea>`,
    (d) => { Store.upsert('members', { ...m, ...d, oneOnOneEvery: Number(d.oneOnOneEvery) || 14 }); toast('Membre enregistré'); });
  }

  function meetingForm(mt = {}) {
    if (!S().members.length) return toast("Ajoutez d'abord un membre à l'équipe");
    const moodPicker = [1, 2, 3, 4, 5].map((n) => `<label title="${n}/5"><input type="radio" name="mood" value="${n}" ${Number(mt.mood || 3) === n ? 'checked' : ''}>${MOODS[n]}</label>`).join('');
    const form = openModal(mt.id ? 'Modifier le one-to-one' : 'Nouveau one-to-one', `
      <div class="row">
        <div><label>Avec</label><select name="memberId" required>${memberOptions(mt.memberId, false)}</select></div>
        <div><label>Date</label><input name="date" type="date" required value="${esc(mt.date || Store.today())}"></div>
      </div>
      <label>Humeur perçue</label><div class="mood-picker">${moodPicker}</div>
      <label>Notes de l'échange <button type="button" class="btn sm" id="prepBtn">✨ Pré-remplir avec le copilote</button></label>
      <textarea name="notes" rows="8">${esc(mt.notes)}</textarea>
      <label>Actions décidées (une par ligne)</label><textarea name="actions">${esc(mt.actions)}</textarea>
      <label>Sujets pour le prochain 1:1</label><textarea name="nextTopics">${esc(mt.nextTopics)}</textarea>
      ${mt.id ? '' : '<div class="checklist"><label><input type="checkbox" name="createTasks" checked> Créer des tâches à partir des actions</label></div>'}`,
    (d) => {
      const { createTasks, ...rest } = d;
      Store.upsert('meetings', { ...mt, ...rest, mood: Number(d.mood) });
      if (createTasks && d.actions) {
        d.actions.split('\n').map((a) => a.trim()).filter(Boolean).forEach((title) =>
          Store.upsert('tasks', { title, memberId: d.memberId, due: Store.addDays(7), status: 'todo', priority: 'medium', description: `Issue du 1:1 du ${fmtDate(d.date)}` }));
      }
      toast('One-to-one enregistré');
    });
    $('#prepBtn', form).onclick = () => {
      const ta = $('textarea[name=notes]', form);
      const txt = Copilot.prepareOneOnOne(S(), $('select[name=memberId]', form).value);
      ta.value = ta.value ? ta.value + '\n\n' + txt : txt;
    };
  }

  function taskForm(t = {}) {
    openModal(t.id ? 'Modifier la tâche' : 'Nouvelle tâche', `
      <label>Titre</label><input name="title" required value="${esc(t.title)}">
      <div class="row">
        <div><label>Assignée à</label><select name="memberId">${memberOptions(t.memberId)}</select></div>
        <div><label>Échéance</label><input name="due" type="date" value="${esc(t.due)}"></div>
      </div>
      <div class="row">
        <div><label>Priorité</label><select name="priority">${Object.entries(PRIORITY).map(([k, [l]]) => `<option value="${k}" ${(t.priority || 'medium') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div><label>Statut</label><select name="status">${Object.entries(STATUS).map(([k, l]) => `<option value="${k}" ${(t.status || 'todo') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      </div>
      <label>Description</label><textarea name="description">${esc(t.description)}</textarea>`,
    (d) => { Store.upsert('tasks', { ...t, ...d }); toast('Tâche enregistrée'); });
  }

  function goalForm(g = {}) {
    openModal(g.id ? "Modifier l'objectif" : 'Nouvel objectif', `
      <label>Objectif</label><input name="title" required value="${esc(g.title)}">
      <div class="row">
        <div><label>Porté par</label><select name="memberId">${memberOptions(g.memberId).replace('Moi / non assigné', "Toute l'équipe")}</select></div>
        <div><label>Échéance</label><input name="due" type="date" value="${esc(g.due)}"></div>
      </div>
      <label>Avancement : <output id="pv">${g.progress || 0}</output> %</label>
      <input name="progress" type="range" min="0" max="100" step="5" value="${g.progress || 0}" oninput="document.getElementById('pv').textContent=this.value">
      <label>Résultats clés (un par ligne)</label><textarea name="keyResults">${esc(g.keyResults)}</textarea>`,
    (d) => { Store.upsert('goals', { ...g, ...d, progress: Number(d.progress) }); toast('Objectif enregistré'); });
  }

  function feedbackForm(f = {}) {
    if (!S().members.length) return toast("Ajoutez d'abord un membre à l'équipe");
    const form = openModal(f.id ? 'Modifier le feedback' : 'Nouveau feedback', `
      <div class="row">
        <div><label>Pour</label><select name="memberId" required>${memberOptions(f.memberId, false)}</select></div>
        <div><label>Date</label><input name="date" type="date" value="${esc(f.date || Store.today())}"></div>
        <div><label>Type</label><select name="type"><option value="positive" ${f.type !== 'constructive' ? 'selected' : ''}>Positif</option><option value="constructive" ${f.type === 'constructive' ? 'selected' : ''}>Constructif</option></select></div>
      </div>
      <label>Feedback <button type="button" class="btn sm" id="sbiBtn">✨ Trame SBI</button></label>
      <textarea name="text" required rows="6">${esc(f.text)}</textarea>
      <p class="small muted">Méthode SBI : décrivez la Situation, le Comportement observé et son Impact.</p>`,
    (d) => { Store.upsert('feedbacks', { ...f, ...d }); toast('Feedback enregistré'); });
    $('#sbiBtn', form).onclick = () => { $('textarea[name=text]', form).value = Copilot.sbiTemplate($('select[name=type]', form).value); };
  }

  function confirmDelete(coll, id, label) {
    openModal('Supprimer ?', `<p>Voulez-vous vraiment supprimer ${esc(label)} ? Cette action est irréversible.</p>`,
      () => { Store.remove(coll, id); toast('Supprimé'); if (coll === 'members') location.hash = '#/team'; }, 'Supprimer');
  }

  // ---------- Vues ----------
  const views = {
    dashboard() {
      const s = S();
      const today = Store.today();
      const open = s.tasks.filter((t) => t.status !== 'done');
      const overdue = open.filter((t) => t.due && t.due < today);
      const recent = s.meetings.filter((m) => Copilot.daysBetween(m.date, today) <= 30);
      const avgMood = recent.length ? (recent.reduce((a, m) => a + Number(m.mood), 0) / recent.length).toFixed(1) : '—';
      const sugg = Copilot.suggestions(s);
      const upcoming = open.filter((t) => t.due).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6);

      return `
        <div class="grid stats">
          <div class="card stat"><div class="value">${s.members.length}</div><div class="label">Membres de l'équipe</div></div>
          <div class="card stat"><div class="value">${open.length}</div><div class="label">Tâches ouvertes</div></div>
          <div class="card stat"><div class="value" style="color:${overdue.length ? 'var(--danger)' : 'inherit'}">${overdue.length}</div><div class="label">Tâches en retard</div></div>
          <div class="card stat"><div class="value">${avgMood}</div><div class="label">Humeur moyenne (30 j)</div></div>
        </div>
        <div class="grid two section">
          <div class="card">
            <h3>✨ Le copilote vous suggère</h3>
            ${sugg.length ? `<div class="grid">${sugg.map((x) => `
              <div class="card suggestion ${x.level}">
                <span class="ico">${x.icon}</span>
                <div class="grow"><div>${esc(x.text)}</div>
                ${x.action ? `<a class="btn sm" style="margin-top:8px;display:inline-block;text-decoration:none" href="#/${x.action.route}">${esc(x.action.label)}</a>` : ''}</div>
              </div>`).join('')}</div>` : '<p class="empty">Tout est sous contrôle 👌</p>'}
          </div>
          <div class="grid" style="align-content:start">
            <div class="card">
              <h3>📅 Prochaines échéances</h3>
              ${upcoming.length ? `<ul class="list">${upcoming.map((t) => `<li><div class="grow"><div>${esc(t.title)}</div><div class="small muted">${esc(memberName(t.memberId))}</div></div>${dueBadge(t)}</li>`).join('')}</ul>` : '<p class="muted">Aucune échéance.</p>'}
            </div>
            <div class="card">
              <h3>👥 Mon équipe</h3>
              ${s.members.length ? `<ul class="list">${s.members.map((m) => {
                const last = Copilot.lastMeeting(s, m.id);
                return `<li><a href="#/member/${m.id}" class="person grow" style="text-decoration:none;color:inherit">${avatar(m, 34)}<div><div class="name">${esc(m.name)}</div><div class="small muted">Dernier 1:1 : ${last ? fmtDate(last.date) : 'jamais'}</div></div></a><span class="mood">${last ? MOODS[last.mood] : ''}</span></li>`;
              }).join('')}</ul>` : '<p class="muted">Aucun membre.</p>'}
            </div>
          </div>
        </div>`;
    },

    team() {
      const list = S().members.filter((m) => matches(m.name, m.role, m.notes));
      return `
        <div class="toolbar"><span class="muted">${list.length} membre(s)</span><span class="spacer"></span><button class="btn primary" data-act="new-member">+ Ajouter un membre</button></div>
        ${list.length ? `<div class="grid cards">${list.map((m) => {
          const last = Copilot.lastMeeting(S(), m.id);
          const open = S().tasks.filter((t) => t.memberId === m.id && t.status !== 'done').length;
          return `<a class="card" href="#/member/${m.id}" style="text-decoration:none;color:inherit">
            <div class="person">${avatar(m)}<div><div class="name">${esc(m.name)}</div><div class="small muted">${esc(m.role || '—')}</div></div></div>
            <div class="toolbar" style="margin:14px 0 0">
              <span class="badge">${open} tâche(s)</span>
              <span class="badge ${last ? '' : 'warn'}">1:1 : ${last ? fmtDate(last.date) : 'jamais'}</span>
              ${last ? `<span class="mood">${MOODS[last.mood]}</span>` : ''}
            </div></a>`;
        }).join('')}</div>` : '<div class="card empty">Aucun membre. Ajoutez votre premier collaborateur !</div>'}`;
    },

    member(id) {
      const s = S();
      const m = Store.find('members', id);
      if (!m) return '<div class="card empty">Membre introuvable.</div>';
      const meetings = s.meetings.filter((x) => x.memberId === id).sort((a, b) => b.date.localeCompare(a.date));
      const tasks = s.tasks.filter((x) => x.memberId === id);
      const goals = s.goals.filter((x) => x.memberId === id);
      const fbs = s.feedbacks.filter((x) => x.memberId === id).sort((a, b) => b.date.localeCompare(a.date));
      const tenure = m.startDate ? Copilot.daysBetween(m.startDate, Store.today()) : null;
      return `
        <div class="card">
          <div class="toolbar" style="margin:0">
            <div class="person">${avatar(m, 56)}<div><div class="name" style="font-size:20px">${esc(m.name)}</div>
              <div class="muted">${esc(m.role || '')}${m.email ? ' · <a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a>' : ''}</div>
              <div class="small muted">${tenure !== null ? `Dans l'équipe depuis ${tenure} jours` : ''} · 1:1 tous les ${m.oneOnOneEvery || 14} j</div></div></div>
            <span class="spacer"></span>
            <button class="btn" data-act="edit-member" data-id="${id}">Modifier</button>
            <button class="btn danger" data-act="del-member" data-id="${id}">Supprimer</button>
          </div>
          ${m.notes ? `<p class="prep" style="margin-top:14px">${esc(m.notes)}</p>` : ''}
        </div>
        <div class="card section">
          <div class="toolbar" style="margin-bottom:8px"><h3 style="margin:0">✨ Préparation du prochain 1:1</h3><span class="spacer"></span>
            <button class="btn" data-act="copy-prep">Copier</button>
            <button class="btn primary" data-act="new-meeting" data-member="${id}">Démarrer le 1:1</button></div>
          <div class="prep" id="prepText">${esc(Copilot.prepareOneOnOne(s, id))}</div>
        </div>
        <div class="grid two section">
          <div class="card"><h3>🗣️ Historique des 1:1</h3>
            ${meetings.length ? `<ul class="list">${meetings.map((x) => `<li><span class="mood">${MOODS[x.mood]}</span><div class="grow"><div class="name">${fmtDate(x.date)}</div><div class="small muted">${esc((x.notes || '').slice(0, 140))}${(x.notes || '').length > 140 ? '…' : ''}</div></div><button class="btn sm" data-act="edit-meeting" data-id="${x.id}">Ouvrir</button></li>`).join('')}</ul>` : '<p class="muted">Aucun 1:1.</p>'}
          </div>
          <div class="card"><h3>✅ Tâches</h3>
            ${tasks.length ? `<ul class="list">${tasks.map((t) => `<li><div class="grow"><div style="${t.status === 'done' ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(t.title)}</div></div><span class="badge">${STATUS[t.status]}</span>${dueBadge(t)}</li>`).join('')}</ul>` : '<p class="muted">Aucune tâche.</p>'}
            <button class="btn sm" data-act="new-task" data-member="${id}" style="margin-top:8px">+ Tâche</button>
          </div>
          <div class="card"><h3>🎯 Objectifs</h3>
            ${goals.length ? goals.map((g) => `<div style="margin-bottom:12px"><div class="toolbar" style="margin:0 0 4px"><span>${esc(g.title)}</span><span class="spacer"></span><span class="small muted">${g.progress} %</span></div><div class="progress"><div style="width:${g.progress}%"></div></div></div>`).join('') : '<p class="muted">Aucun objectif.</p>'}
          </div>
          <div class="card"><h3>💬 Feedbacks</h3>
            ${fbs.length ? `<ul class="list">${fbs.map((f) => `<li><span class="badge ${f.type === 'positive' ? 'ok' : 'warn'}">${f.type === 'positive' ? 'Positif' : 'Constructif'}</span><div class="grow"><div>${esc(f.text)}</div><div class="small muted">${fmtDate(f.date)}</div></div></li>`).join('')}</ul>` : '<p class="muted">Aucun feedback.</p>'}
            <button class="btn sm" data-act="new-feedback" data-member="${id}" style="margin-top:8px">+ Feedback</button>
          </div>
        </div>`;
    },

    meetings() {
      const list = S().meetings.filter((x) => matches(memberName(x.memberId), x.notes, x.actions)).sort((a, b) => b.date.localeCompare(a.date));
      return `
        <div class="toolbar"><span class="muted">${list.length} échange(s)</span><span class="spacer"></span><button class="btn primary" data-act="new-meeting">+ Nouveau 1:1</button></div>
        ${list.length ? `<div class="card"><ul class="list">${list.map((x) => {
          const m = Store.find('members', x.memberId);
          return `<li>${m ? avatar(m, 34) : ''}<div class="grow"><div class="name">${esc(memberName(x.memberId))} · <span class="muted">${fmtDate(x.date)}</span></div>
            <div class="small muted">${esc((x.notes || '').slice(0, 180))}</div>
            ${x.actions ? `<div class="small" style="margin-top:4px">➡️ ${esc(x.actions.split('\n').filter(Boolean).join(' · '))}</div>` : ''}</div>
            <span class="mood">${MOODS[x.mood]}</span>
            <button class="btn sm" data-act="edit-meeting" data-id="${x.id}">Ouvrir</button>
            <button class="btn sm danger" data-act="del-meeting" data-id="${x.id}">✕</button></li>`;
        }).join('')}</ul></div>` : '<div class="card empty">Aucun one-to-one enregistré.</div>'}`;
    },

    tasks() {
      const filter = sessionStorage.getItem('taskFilter') || '';
      const list = S().tasks.filter((t) => (!filter || t.memberId === filter || (filter === 'me' && !t.memberId)) && matches(t.title, t.description, memberName(t.memberId)));
      const rank = { high: 0, medium: 1, low: 2 };
      const col = (status) => {
        const items = list.filter((t) => t.status === status).sort((a, b) => rank[a.priority] - rank[b.priority] || (a.due || '9').localeCompare(b.due || '9'));
        return `<div class="column" data-status="${status}"><h3>${STATUS[status]} <span class="badge">${items.length}</span></h3>
          ${items.map((t) => `<div class="task" draggable="true" data-id="${t.id}">
            <div class="title">${esc(t.title)}</div>
            <div class="meta"><span class="badge ${PRIORITY[t.priority][1]}">${PRIORITY[t.priority][0]}</span>${dueBadge(t)}<span class="small muted">${esc(memberName(t.memberId))}</span></div>
            <div class="meta">
              ${status !== 'todo' ? `<button class="btn sm" data-act="move-task" data-id="${t.id}" data-to="${status === 'done' ? 'doing' : 'todo'}">←</button>` : ''}
              ${status !== 'done' ? `<button class="btn sm" data-act="move-task" data-id="${t.id}" data-to="${status === 'todo' ? 'doing' : 'done'}">→</button>` : ''}
              <span class="spacer" style="flex:1"></span>
              <button class="btn sm" data-act="edit-task" data-id="${t.id}">Modifier</button>
              <button class="btn sm danger" data-act="del-task" data-id="${t.id}">✕</button>
            </div></div>`).join('')}</div>`;
      };
      return `
        <div class="toolbar">
          <select id="taskFilter" style="max-width:240px"><option value="">Toute l'équipe</option><option value="me" ${filter === 'me' ? 'selected' : ''}>Moi / non assigné</option>${S().members.map((m) => `<option value="${m.id}" ${filter === m.id ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}</select>
          <span class="spacer"></span><button class="btn primary" data-act="new-task">+ Nouvelle tâche</button>
        </div>
        <div class="kanban">${col('todo')}${col('doing')}${col('done')}</div>`;
    },

    goals() {
      const list = S().goals.filter((g) => matches(g.title, g.keyResults, memberName(g.memberId)));
      return `
        <div class="toolbar"><span class="muted">${list.length} objectif(s)</span><span class="spacer"></span><button class="btn primary" data-act="new-goal">+ Nouvel objectif</button></div>
        ${list.length ? `<div class="grid cards">${list.map((g) => `
          <div class="card">
            <div class="toolbar" style="margin:0 0 6px"><strong>${esc(g.title)}</strong></div>
            <div class="small muted">${g.memberId ? esc(memberName(g.memberId)) : "Toute l'équipe"} · échéance ${fmtDate(g.due)}</div>
            <div class="toolbar" style="margin:12px 0 4px"><div class="progress" style="flex:1"><div style="width:${g.progress}%;background:${g.progress >= 100 ? 'var(--ok)' : 'var(--primary)'}"></div></div><span class="small">${g.progress} %</span></div>
            ${g.keyResults ? `<ul class="small" style="padding-left:18px;margin:10px 0">${g.keyResults.split('\n').filter(Boolean).map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
            <div class="toolbar" style="margin:8px 0 0"><button class="btn sm" data-act="edit-goal" data-id="${g.id}">Mettre à jour</button><button class="btn sm danger" data-act="del-goal" data-id="${g.id}">Supprimer</button></div>
          </div>`).join('')}</div>` : '<div class="card empty">Aucun objectif défini.</div>'}`;
    },

    feedback() {
      const list = S().feedbacks.filter((f) => matches(f.text, memberName(f.memberId))).sort((a, b) => b.date.localeCompare(a.date));
      const pos = list.filter((f) => f.type === 'positive').length;
      return `
        <div class="toolbar"><span class="badge ok">${pos} positif(s)</span><span class="badge warn">${list.length - pos} constructif(s)</span><span class="spacer"></span><button class="btn primary" data-act="new-feedback">+ Nouveau feedback</button></div>
        ${list.length ? `<div class="card"><ul class="list">${list.map((f) => {
          const m = Store.find('members', f.memberId);
          return `<li>${m ? avatar(m, 34) : ''}<div class="grow"><div class="name">${esc(memberName(f.memberId))} <span class="badge ${f.type === 'positive' ? 'ok' : 'warn'}">${f.type === 'positive' ? 'Positif' : 'Constructif'}</span></div>
            <div style="white-space:pre-wrap">${esc(f.text)}</div><div class="small muted">${fmtDate(f.date)}</div></div>
            <button class="btn sm" data-act="edit-feedback" data-id="${f.id}">Modifier</button>
            <button class="btn sm danger" data-act="del-feedback" data-id="${f.id}">✕</button></li>`;
        }).join('')}</ul></div>` : '<div class="card empty">Aucun feedback noté.</div>'}`;
    },

    settings() {
      return `
        <div class="grid two">
          <div class="card"><h3>💾 Sauvegarde</h3>
            <p class="muted">Vos données sont stockées uniquement dans ce navigateur. Exportez-les régulièrement pour les sauvegarder ou les transférer sur un autre appareil.</p>
            <div class="toolbar"><button class="btn primary" data-act="export">Exporter (JSON)</button>
            <label class="btn" style="margin:0;font-weight:500">Importer<input type="file" id="importFile" accept="application/json,.json" hidden></label></div>
          </div>
          <div class="card"><h3>🧹 Réinitialisation</h3>
            <p class="muted">Repartir de zéro ou recharger les données de démonstration.</p>
            <div class="toolbar"><button class="btn" data-act="reset-demo">Charger la démo</button><button class="btn danger" data-act="reset-empty">Tout effacer</button></div>
          </div>
        </div>`;
    },
  };

  const TITLES = { dashboard: 'Tableau de bord', team: 'Équipe', member: 'Fiche membre', meetings: 'One-to-one', tasks: 'Tâches', goals: 'Objectifs', feedback: 'Feedbacks', settings: 'Données' };

  // ---------- Routeur ----------
  function render() {
    const parts = (location.hash.replace(/^#\/?/, '') || 'dashboard').split('/');
    let [route, arg, arg2] = parts;

    // routes « action » : ouvrent une modale puis reviennent à la vue de base
    if (arg === 'new') {
      const base = route;
      history.replaceState(null, '', base === 'team' ? '#/team' : '#/' + base);
      setTimeout(() => {
        if (base === 'team') memberForm();
        if (base === 'meetings') meetingForm({ memberId: arg2 });
        if (base === 'feedback') feedbackForm({ memberId: arg2 });
      });
      arg = undefined;
    }

    if (!views[route]) route = 'dashboard';
    $('#pageTitle').textContent = route === 'member' && Store.find('members', arg) ? Store.find('members', arg).name : TITLES[route];
    document.title = `${TITLES[route]} · Copilote Manager`;
    $$('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === route || (route === 'member' && a.dataset.route === 'team')));
    view.innerHTML = views[route](arg);
    if (route === 'tasks') bindKanban();
    $('#sidebar').classList.remove('open');
  }

  function bindKanban() {
    $('#taskFilter').onchange = (e) => { sessionStorage.setItem('taskFilter', e.target.value); render(); };
    $$('.task').forEach((el) => el.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', el.dataset.id)));
    $$('.column').forEach((col) => {
      col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
      col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        const t = Store.find('tasks', e.dataTransfer.getData('text/plain'));
        if (t) { t.status = col.dataset.status; Store.save(); render(); }
      });
    });
  }

  // ---------- Actions (délégation d'événements) ----------
  const actions = {
    'new-member': () => memberForm(),
    'edit-member': (d) => memberForm(Store.find('members', d.id)),
    'del-member': (d) => confirmDelete('members', d.id, `ce membre et son historique`),
    'new-meeting': (d) => meetingForm({ memberId: d.member }),
    'edit-meeting': (d) => meetingForm(Store.find('meetings', d.id)),
    'del-meeting': (d) => confirmDelete('meetings', d.id, 'ce one-to-one'),
    'new-task': (d) => taskForm({ memberId: d.member }),
    'edit-task': (d) => taskForm(Store.find('tasks', d.id)),
    'del-task': (d) => confirmDelete('tasks', d.id, 'cette tâche'),
    'move-task': (d) => { const t = Store.find('tasks', d.id); t.status = d.to; Store.save(); render(); },
    'new-goal': () => goalForm(),
    'edit-goal': (d) => goalForm(Store.find('goals', d.id)),
    'del-goal': (d) => confirmDelete('goals', d.id, 'cet objectif'),
    'new-feedback': (d) => feedbackForm({ memberId: d.member }),
    'edit-feedback': (d) => feedbackForm(Store.find('feedbacks', d.id)),
    'del-feedback': (d) => confirmDelete('feedbacks', d.id, 'ce feedback'),
    'copy-prep': () => navigator.clipboard.writeText($('#prepText').textContent).then(() => toast('Copié dans le presse-papiers')),
    export: () => {
      const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `copilote-manager-${Store.today()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    'reset-demo': () => openModal('Charger la démo ?', '<p>Vos données actuelles seront remplacées par les données de démonstration.</p>', () => { Store.reset(true); toast('Démo chargée'); }, 'Confirmer'),
    'reset-empty': () => openModal('Tout effacer ?', '<p>Toutes vos données seront supprimées définitivement.</p>', () => { Store.reset(false); toast('Données effacées'); }, 'Tout effacer'),
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    e.preventDefault();
    const fn = actions[el.dataset.act];
    if (fn) fn(el.dataset);
  });

  document.addEventListener('change', (e) => {
    if (e.target.id !== 'importFile') return;
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((txt) => {
      try { Store.importJSON(txt); toast('Données importées'); render(); } catch (err) { toast('Import impossible : ' + err.message); }
    });
  });

  $('#globalSearch').addEventListener('input', (e) => {
    search = e.target.value.trim().toLowerCase();
    const r = (location.hash.replace(/^#\/?/, '') || 'dashboard').split('/')[0];
    if (['dashboard', 'member', 'settings'].includes(r)) location.hash = '#/team'; else render();
  });
  $('#menuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  window.addEventListener('hashchange', render);
  render();
})();
