// Only non-sensitive navigation preferences are stored here.
export const filterDefaults = { poolSearch: '', poolSport: '', poolAll: false, pickSearch: '', pickSport: '', pickRound: '', sort: 'rank', sortAsc: true };

// Month-end planning allowances, not actual fixture dates. Deliberately stable:
// opening the app next year must not silently move an existing league's season.
export const championshipMonths = { NBA: 6, NFL: 2, MLB: 11, NHL: 6,
  'NCAA Football': 1, 'NCAA Basketball': 4, 'UEFA Champions League': 6,
  NASCAR: 11, 'Masters Tournament': 4 };

export function leagueTimeframe(league) {
  const seasonStart = Date.UTC(Number(league.season), 0, 1);
  const created = league.createdAt || league.activity?.find(event => event.text === 'Created the league.')?.at || seasonStart;
  const draftStart = league.draftStartedAt || league.picks?.[0]?.at || league.scheduled;
  const start = draftStart || Math.max(created, seasonStart);
  const year = new Date(start).getUTCFullYear();
  const events = league.sports.map(sport => {
    const edition=league.editions?.find(e=>e.sport===sport);
    if(edition){const [y,m]=edition.endMonth.split('-').map(Number);return {sport,end:Date.UTC(y,m,0,23,59,59,999)};}
    const month = championshipMonths[sport];
    let end = Date.UTC(year, month, 0, 23, 59, 59, 999);
    if (end < start) end = Date.UTC(year + 1, month, 0, 23, 59, 59, 999);
    return { sport, end };
  });
  const end = Math.max(...events.map(event => event.end));
  return { start, startKnown: !!draftStart, end, events,
    lastSports: events.filter(event => event.end === end).map(event => event.sport) };
}

export function overrideTeams(league, search = '', sport = '') {
  const drafted = new Set(league.picks.map(pick => pick.team.id));
  const filled = new Set(league.picks.filter(pick => pick.userId === league.current?.id).map(pick => pick.team.sport));
  const query = search.trim().toLocaleLowerCase();
  return league.teams.filter(team => !drafted.has(team.id) && (!sport || team.sport === sport) &&
    `${team.name} ${team.sport}`.toLocaleLowerCase().includes(query))
    .map(team => ({ ...team, unavailableReason: filled.has(team.sport) ? 'Manager already has a team in this sport' : '' }));
}

export function scoreExplanation(pick) {
  if (pick.override != null) return `The commissioner set this score to ${pick.override} points. See Activity for the reason and previous score.`;
  if (!pick.finish) return 'The result has not been recorded yet. No points have been awarded.';
  const placement = Math.max(0, 10 - pick.finish);
  if (pick.finish === 1) return `Won the championship, earning ${placement} points for first place plus a 3-point champion bonus — 12 points in total.`;
  if (pick.finish === 2) {
    const final = ['NBA', 'NFL', 'MLB', 'NHL', 'NCAA Football', 'NCAA Basketball', 'UEFA Champions League'].includes(pick.team.sport);
    return `${final ? 'Reached the final and finished runner-up' : 'Finished runner-up'}, earning ${placement} points for second place plus a 1-point runner-up bonus — 9 points in total.`;
  }
  const suffix = pick.finish % 100 >= 11 && pick.finish % 100 <= 13 ? 'th' : ({1:'st',2:'nd',3:'rd'}[pick.finish % 10] || 'th');
  return `Finished in ${pick.finish}${suffix} place, earning ${placement} ${placement === 1 ? 'point' : 'points'}. No championship or runner-up bonus applies.`;
}

// Error descriptions supplement hints and are removed independently on correction.
export function clearFieldError(input) {
  const errorId = input.dataset.validationError;
  if (!errorId) return;
  const form = input.form;
  const peers = [...form.elements].filter(control => control.dataset?.validationError === errorId);
  for (const control of peers) {
    control.removeAttribute('aria-invalid');
    const remaining = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== errorId);
    if (remaining.length) control.setAttribute('aria-describedby', remaining.join(' '));
    else control.removeAttribute('aria-describedby');
    delete control.dataset.validationError;
  }
  form.querySelectorAll('[data-validation-message]').forEach(message => {
    if (message.id === errorId) message.remove();
  });
}

export function setFieldError(form, name, message) {
  const controls = [...form.elements].filter(control => control.name === name && control.type !== 'hidden');
  if (!controls.length) return false;
  controls.forEach(clearFieldError);
  const first = controls[0];
  const error = document.createElement('small');
  error.id = `${form.dataset.form || 'form'}-${name}-error`;
  error.className = 'field-error';
  error.dataset.validationMessage = '';
  error.textContent = message;
  (first.closest('fieldset') || first.parentElement).append(error);
  for (const control of controls) {
    control.dataset.validationError = error.id;
    control.setAttribute('aria-invalid', 'true');
    const descriptions = new Set((control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    descriptions.add(error.id);
    control.setAttribute('aria-describedby', [...descriptions].join(' '));
  }
  first.focus();
  return true;
}

export function syncDraftPanelSemantics(root, mobile) {
  root.querySelectorAll('[id^=draft-panel-]').forEach(panel => {
    if (mobile) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', panel.id.replace('panel', 'tab'));
    } else {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-labelledby');
    }
  });
}

export function picksUntilTurn(league, userId) {
  const count = league.members.length;
  for (let pick = league.picks.length; pick < count * league.sports.length; pick++) {
    const round = Math.floor(pick / count);
    const manager = league.members[round % 2 ? count - 1 - pick % count : pick % count];
    if (manager.id === userId) return pick - league.picks.length;
  }
  return null;
}

const keyOf = node => node.nodeType === 1
  ? node.id || node.getAttribute('data-key') || node.getAttribute('data-focus') ||
    (node.getAttribute('data-form') && 'form:' + node.getAttribute('data-form')) ||
    (node.tagName === 'INPUT' && node.name ? 'input:' + node.name + ':' + (node.type === 'checkbox' ? node.value : '') : '')
  : '';

// Reconcile in place so queue moves and background refreshes keep actual DOM
// controls, focus, scroll positions, and expanded disclosure state intact.
function patchNode(current, next) {
  if (current.nodeType !== 1) {
    if (current.nodeValue !== next.nodeValue) current.nodeValue = next.nodeValue;
    return;
  }
  const disclosureOpen = current.tagName === 'DETAILS' && current.open;
  for (const attr of [...current.attributes]) if (!next.hasAttribute(attr.name)) current.removeAttribute(attr.name);
  for (const attr of next.attributes) if (current.getAttribute(attr.name) !== attr.value) current.setAttribute(attr.name, attr.value);
  if (current.tagName === 'INPUT') {
    if (current.value !== next.value) current.value = next.value;
    current.checked = next.checked;
  }
  patchChildren(current, next);
  if (current.tagName === 'SELECT') current.value = next.value;
  if (current.tagName === 'TEXTAREA' && current !== document.activeElement) current.value = next.value;
  if (disclosureOpen) current.open = true;
}

function patchChildren(parent, nextParent) {
  const previous = [...parent.childNodes], used = new Set();
  const keyed = new Map(previous.filter(keyOf).map(node => [keyOf(node), node]));
  let cursor = parent.firstChild;
  for (const next of [...nextParent.childNodes]) {
    const key = keyOf(next);
    let current = key ? keyed.get(key) : previous.find(node => !used.has(node) && !keyOf(node) && node.nodeType === next.nodeType && node.nodeName === next.nodeName);
    if (current && (current.nodeType !== next.nodeType || current.nodeName !== next.nodeName)) current = null;
    if (current) {
      used.add(current);
      // moveBefore preserves focus on browsers that implement stateful moves.
      if (current !== cursor) {
        if (parent.moveBefore && current.parentNode === parent) parent.moveBefore(current, cursor);
        else parent.insertBefore(current, cursor);
      }
      patchNode(current, next);
    } else {
      current = next.cloneNode(true);
      parent.insertBefore(current, cursor);
    }
    cursor = current.nextSibling;
  }
  for (const node of previous) if (!used.has(node)) node.remove();
}

export function reconcile(container, html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  patchChildren(container, template.content);
}
