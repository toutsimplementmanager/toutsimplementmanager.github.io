/**
 * Copilote Manager — réception des inscriptions dans Google Sheets
 *
 * Installation : voir google-sheet/INSTALLATION.md
 * Une ligne par inscrit. Le profil est mis à jour à chaque quiz.
 */
const SHEET_NAME = 'Inscrits';
const HEADERS = ['Date d\'inscription', 'Prénom', 'Email', 'Accepte les conseils (consentement)', 'Profil', 'Date du dernier quiz', 'Nombre de quiz', 'Scores du dernier quiz'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const email = String(data.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return reply('email invalide');

    const sheet = getSheet();
    const row = findRow(sheet, email);

    if (data.event === 'inscription') {
      const values = [toDate(data.date), clean(data.firstName), email, data.consent ? 'Oui' : 'Non'];
      if (row) sheet.getRange(row, 1, 1, 4).setValues([values]);
      else sheet.appendRow(values.concat(['', '', 0, '']));
    } else if (data.event === 'quiz') {
      const target = row || (sheet.appendRow([toDate(data.date), clean(data.firstName), email, 'Non', '', '', 0, '']), sheet.getLastRow());
      const count = Number(sheet.getRange(target, 7).getValue()) || 0;
      const scores = Object.entries(data.scores || {}).map(([k, v]) => k + ' ' + Number(v)).join(' · ');
      sheet.getRange(target, 5, 1, 4).setValues([[clean(data.profileName || data.profile), toDate(data.date), count + 1, clean(scores)]]);
    } else {
      return reply('événement inconnu');
    }
    return reply('ok');
  } catch (err) {
    return reply('erreur : ' + err);
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRow(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const emails = sheet.getRange(2, 3, last - 1, 1).getValues();
  const i = emails.findIndex((r) => String(r[0]).toLowerCase() === email);
  return i === -1 ? null : i + 2;
}

// Évite qu'un texte commençant par = + - @ soit interprété comme une formule, et limite la longueur.
function clean(v) {
  const s = String(v == null ? '' : v).slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function toDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? new Date() : d;
}

function reply(msg) {
  return ContentService.createTextOutput(msg);
}

/** Pour tester depuis l'éditeur Apps Script : sélectionne « testInstallation » puis clique sur Exécuter. */
function testInstallation() {
  const post = (obj) => doPost({ postData: { contents: JSON.stringify(obj) } }).getContent();
  Logger.log(post({ event: 'inscription', firstName: 'Test', email: 'test@exemple.fr', consent: true, date: new Date().toISOString() }));
  Logger.log(post({ event: 'quiz', firstName: 'Test', email: 'test@exemple.fr', profile: 'copain', profileName: 'Copain', scores: { copain: 6, absent: 4 }, date: new Date().toISOString() }));
}
