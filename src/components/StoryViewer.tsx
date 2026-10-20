import { useEffect } from 'react';
import { BeadArt, Icon, type Story } from './index';

export interface StoryViewerProps {
  stories: (Story & { caption?: string })[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  /** Durée d'une story en millisecondes. */
  duration?: number;
}

/** Visionneuse plein écran : barres de progression, avance automatique, flèches, Échap pour fermer. */
export function StoryViewer({ stories, index, onClose, onNext, onPrev, duration = 4000 }: StoryViewerProps) {
  const s = stories[index];

  useEffect(() => {
    const t = window.setTimeout(onNext, duration);
    return () => window.clearTimeout(t);
  }, [index, duration, onNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="sv" role="dialog" aria-modal="true" aria-label={'Story : ' + s.label}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sv-card">
        <div className="sv-bars">
          {stories.map((x, i) => (
            <span key={x.id + (i === index ? '-run' : '')}
              className={'sv-bar' + (i < index ? ' done' : i === index ? ' run' : '')}
              style={{ ['--sv-duration' as string]: duration + 'ms' }}>
              <i />
            </span>
          ))}
        </div>
        <div className="sv-head">
          <span>{s.label}</span>
          <button type="button" className="sv-btn" onClick={onClose} aria-label="Fermer" autoFocus><Icon name="close" /></button>
        </div>
        {s.imageSrc ? <img className="sv-img" src={s.imageSrc} alt="" /> : <BeadArt seed={s.seed} beads={9} ratio={0.56} />}
        <button type="button" className="sv-btn sv-nav sv-prev" onClick={onPrev} aria-label="Story précédente"><Icon name="chevron-left" /></button>
        <button type="button" className="sv-btn sv-nav sv-next" onClick={onNext} aria-label="Story suivante"><Icon name="chevron-right" /></button>
        {s.caption && <p className="sv-cap">{s.caption}</p>}
      </div>
    </div>
  );
}
