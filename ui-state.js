// Only non-sensitive navigation preferences are stored here.
export const filterDefaults = { poolSearch: '', poolSport: '', poolAll: false, pickSearch: '', pickSport: '', pickRound: '', sort: 'rank', sortAsc: true };

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
