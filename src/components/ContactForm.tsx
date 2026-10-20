import { useState, type FormEvent } from 'react';
import { Icon } from './index';

/**
 * Formulaire de contact envoyé par Formspree (https://formspree.io) : le message arrive par e-mail à la créatrice.
 * L'identifiant du formulaire (« xxxxxxxx » dans https://formspree.io/f/xxxxxxxx) est public : il ne permet que d'envoyer un message.
 */
export interface ContactFormProps { formId: string; onDone?: () => void }

const SUBJECTS = ['Une question sur un bijou', 'Une commande sur mesure', 'Un marché ou un événement', 'Autre chose'];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm({ formId, onDone }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formId) return;
    const form = e.currentTarget;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
        return;
      }
      const data = await res.json().catch(() => null) as { errors?: { message: string }[] } | null;
      setError(data?.errors?.map(x => x.message).join(' ') || '');
      setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="jp-contact-done" role="status">
        <span className="jp-contact-done-icon"><Icon name="heart" size={24} filled /></span>
        <p className="jp-contact-done-title">Merci, votre message est envoyé !</p>
        <p>Je vous réponds dès que possible, en général sous 48 h.</p>
        <button type="button" className="jp-btn jp-btn-secondary jp-btn-sm" onClick={onDone}>Fermer</button>
      </div>
    );
  }

  return (
    <form className="jp-contact" onSubmit={submit}>
      <div className="jp-contact-row">
        <label className="jp-field">
          <span>Nom</span>
          <input name="nom" autoComplete="name" required maxLength={100} autoFocus />
        </label>
        <label className="jp-field">
          <span>E-mail</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label className="jp-field">
        <span>Sujet</span>
        <select name="sujet" defaultValue={SUBJECTS[0]}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="jp-field">
        <span>Message</span>
        <textarea name="message" rows={5} required maxLength={5000} placeholder="Modèle, couleur, date souhaitée…" />
      </label>
      {/* Piège à robots : champ invisible que Formspree ignore s'il est rempli. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="jp-sr" aria-hidden="true" />
      <input type="hidden" name="_subject" value="Nouveau message depuis le site Les-jolies-perles" />

      {status === 'error' && (
        <p className="jp-contact-error" role="alert">
          L'envoi n'a pas abouti{error ? ` : ${error}` : ''}. Réessayez dans un instant.
        </p>
      )}
      <div className="jp-contact-actions">
        <span className="jp-contact-note">
          {formId ? 'Votre adresse ne sert qu\'à vous répondre.' : 'L\'envoi de messages sera bientôt disponible.'}
        </span>
        <button type="submit" className="jp-btn jp-btn-primary" disabled={!formId || status === 'sending'}
          title={formId ? undefined : 'Formulaire pas encore configuré'}>
          <Icon name="mail" size={18} />{status === 'sending' ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}
