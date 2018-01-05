var ID = '__kuker__is_here__';

if (typeof window !== 'undefined') {
  window[ID] = true;
}
if (typeof document !== 'undefined') {
  const el = document.createElement('script');

  el.setAttribute('id', ID);
  (document.head || document.documentElement).appendChild(el);
}
