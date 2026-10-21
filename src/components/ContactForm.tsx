import { useState, type FormEvent } from 'react';
import { Icon } from './index';
import { useI18n } from '../i18n';

/**
 * Contact form sent through Formspree (https://formspree.io): each message reaches the maker by email.
 * The form id ("xxxxxxxx" in https://formspree.io/f/xxxxxxxx) is public: it only allows sending a message.
 * Without an id the form is still shown, but the send button stays disabled.
 */
export interface ContactFormProps { formId: string; onDone?: () => void }

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm({ formId, onDone }: ContactFormProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formId) return;
    const form = e.currentTarget;
    setStatus('sending');
    setError('');
    try {
      const body = new FormData(form);
      // Visitor's address as "Reply-To": Formspree reads the "email" field (and the legacy "_replyto" name).
      body.set('_replyto', String(body.get('email') ?? ''));
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST', body, headers: { Accept: 'application/json' },
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
        <p className="jp-contact-done-title">{t.sentTitle}</p>
        <p>{t.sentText}</p>
        <button type="button" className="jp-btn jp-btn-secondary jp-btn-sm" onClick={onDone}>{t.close}</button>
      </div>
    );
  }

  return (
    <form className="jp-contact" onSubmit={submit}>
      <div className="jp-contact-row">
        <label className="jp-field">
          <span>{t.name}</span>
          <input name="nom" autoComplete="name" required maxLength={100} autoFocus />
        </label>
        <label className="jp-field">
          <span>{t.email}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label className="jp-field">
        <span>{t.subject}</span>
        <select name="sujet" key={t.subjects[0]} defaultValue={t.subjects[0]}>
          {t.subjects.map(s => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="jp-field">
        <span>{t.message}</span>
        <textarea name="message" rows={5} required maxLength={5000} placeholder={t.messagePlaceholder} />
      </label>
      {/* Bot trap: invisible field; Formspree discards the submission when it is filled. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="jp-sr" aria-hidden="true" />
      <input type="hidden" name="_subject" value={t.emailSubject} />

      {status === 'error' && <p className="jp-contact-error" role="alert">{t.sendError(error)}</p>}
      <div className="jp-contact-actions">
        <span className="jp-contact-note">{formId ? t.emailUse : t.formSoon}</span>
        <button type="submit" className="jp-btn jp-btn-primary" disabled={!formId || status === 'sending'}
          title={formId ? undefined : t.formNotReady}>
          <Icon name="mail" size={18} />{status === 'sending' ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
