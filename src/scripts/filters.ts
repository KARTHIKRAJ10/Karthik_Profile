/**
 * Generic directory filtering.
 *
 * Markup contract
 *   [data-filter-root]                     wrapper
 *     [data-filter-search]                 optional text input, matches data-text on cards
 *     [data-filter="<key>"]                <select>, or a group of <button data-value> chips
 *     [data-filter-reset]                  any number of reset buttons
 *     [data-filter-count]                  receives "N of M shown"
 *     [data-filter-empty]                  shown when nothing matches
 *     [data-card data-<key>="a|b|c"]       the items
 *
 * Filter state is mirrored in the query string, so a filtered view is shareable
 * and skill tags elsewhere on the site can deep-link into it (?tech=SQL).
 */
export function initFilters(root: HTMLElement): void {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-card]'));
  const search = root.querySelector<HTMLInputElement>('[data-filter-search]');
  const controls = Array.from(root.querySelectorAll<HTMLElement>('[data-filter]'));
  const count = root.querySelector<HTMLElement>('[data-filter-count]');
  const empty = root.querySelector<HTMLElement>('[data-filter-empty]');
  const resets = Array.from(root.querySelectorAll<HTMLElement>('[data-filter-reset]'));
  const noun = root.dataset.filterNoun ?? 'items';

  const state: Record<string, string> = {};
  let query = '';

  const getControlValue = (el: HTMLElement) =>
    el instanceof HTMLSelectElement ? el.value : (el.querySelector<HTMLElement>('[aria-pressed="true"]')?.dataset.value ?? '');

  function setControlValue(el: HTMLElement, value: string) {
    if (el instanceof HTMLSelectElement) {
      const ok = Array.from(el.options).some((o) => o.value === value);
      el.value = ok ? value : '';
    } else {
      const buttons = Array.from(el.querySelectorAll<HTMLElement>('[data-value]'));
      const match = buttons.some((b) => b.dataset.value === value) ? value : '';
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === match)));
    }
  }

  function apply(pushUrl = true) {
    query = (search?.value ?? '').trim().toLowerCase();
    controls.forEach((el) => (state[el.dataset.filter!] = getControlValue(el)));

    let shown = 0;
    for (const card of cards) {
      const matchesFilters = Object.entries(state).every(([key, value]) => {
        if (!value) return true;
        return (card.dataset[key] ?? '').split('|').includes(value);
      });
      const matchesQuery = !query || query.split(/\s+/).every((word) => (card.dataset.text ?? '').includes(word));
      const visible = matchesFilters && matchesQuery;
      card.hidden = !visible;
      if (visible) shown++;
    }

    const active = Boolean(query) || Object.values(state).some(Boolean);
    if (count) count.textContent = `${shown} of ${cards.length} ${noun} shown`;
    if (empty) empty.hidden = shown !== 0;
    resets.forEach((b) => {
      if (b.hasAttribute('data-filter-reset-inline')) b.hidden = !active;
    });

    if (pushUrl) {
      const params = new URLSearchParams();
      if (query) params.set('q', search!.value.trim());
      for (const [k, v] of Object.entries(state)) if (v) params.set(k, v);
      const qs = params.toString();
      history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
    }
  }

  function reset() {
    if (search) search.value = '';
    controls.forEach((el) => setControlValue(el, ''));
    apply();
    (search ?? controls[0])?.focus();
  }

  // Restore from the query string.
  const params = new URLSearchParams(location.search);
  if (search && params.get('q')) search.value = params.get('q')!;
  controls.forEach((el) => setControlValue(el, params.get(el.dataset.filter!) ?? ''));

  search?.addEventListener('input', () => apply());
  controls.forEach((el) => {
    if (el instanceof HTMLSelectElement) {
      el.addEventListener('change', () => apply());
    } else {
      el.addEventListener('click', (event) => {
        const button = (event.target as HTMLElement).closest<HTMLElement>('[data-value]');
        if (!button) return;
        setControlValue(el, button.dataset.value ?? '');
        apply();
      });
    }
  });
  resets.forEach((b) => b.addEventListener('click', reset));

  apply(false);
}
