import { useEffect, useState } from 'react';
import type { Post } from '../components';

/** Format d'un flux JSON Behold (https://behold.so/docs/json-feeds/), champs utilisés seulement. */
interface BeholdSize { mediaUrl: string; width: number; height: number }
interface BeholdPost {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize; full?: BeholdSize };
  caption?: string;
  prunedCaption?: string;
  likeCount?: number;
  commentsCount?: number;
}
interface BeholdFeed { followersCount?: number; posts: BeholdPost[] }

export interface InstagramFeed {
  status: 'off' | 'loading' | 'ready' | 'error';
  posts: Post[];
  followers?: number;
}

const DAY = 86_400_000;

/** « il y a 3 j », « il y a 2 sem. », « 12 oct. » */
function relativeDate(iso: string, now = Date.now()) {
  const days = Math.floor((now - new Date(iso).getTime()) / DAY);
  if (days < 1) return 'aujourd’hui';
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function toPost(p: BeholdPost): Post {
  const caption = (p.prunedCaption ?? p.caption ?? '').trim();
  return {
    id: p.id,
    network: 'instagram',
    caption: caption.length > 140 ? caption.slice(0, 137).trimEnd() + '…' : caption,
    likes: p.likeCount,
    comments: p.commentsCount,
    date: relativeDate(p.timestamp),
    href: p.permalink,
    imageSrc: p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl,
  };
}

/** Charge les dernières publications Instagram depuis un flux Behold. Sans URL, renvoie `off`. */
export function useInstagramFeed(url: string, limit = 6): InstagramFeed {
  const [feed, setFeed] = useState<InstagramFeed>({ status: url ? 'loading' : 'off', posts: [] });

  useEffect(() => {
    if (!url) return;
    const ctrl = new AbortController();
    fetch(url, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((data: BeholdFeed | BeholdPost[]) => {
        const posts = Array.isArray(data) ? data : data.posts;
        setFeed({
          status: 'ready',
          posts: posts.slice(0, limit).map(toPost),
          followers: Array.isArray(data) ? undefined : data.followersCount,
        });
      })
      .catch(err => { if (err.name !== 'AbortError') setFeed({ status: 'error', posts: [] }); });
    return () => ctrl.abort();
  }, [url, limit]);

  return feed;
}
