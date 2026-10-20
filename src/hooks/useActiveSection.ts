import { useEffect, useState } from 'react';

/** Renvoie l'ancre (« #marches ») de la section visible au milieu de l'écran. */
export function useActiveSection(ids: string[], initial = ids[0]) {
  const [active, setActive] = useState('#' + initial);
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids.join(',')]);
  return active;
}
