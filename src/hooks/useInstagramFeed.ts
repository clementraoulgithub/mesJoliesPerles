import { useEffect, useState } from 'react';
import type { Post } from '../components';

/** Shape of a Behold JSON feed (https://behold.so/docs/json-feeds/), fields used here only. */
interface BeholdSize { mediaUrl: string; width: number; height: number }
interface BeholdPost {
  id: string;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize; full?: BeholdSize };
  caption?: string;
  prunedCaption?: string;
}
interface BeholdFeed { followersCount?: number; posts: BeholdPost[] }

export interface InstagramFeed {
  status: 'off' | 'loading' | 'ready' | 'error';
  posts: Post[];
  followers?: number;
}

function toPost(p: BeholdPost): Post {
  const caption = (p.prunedCaption ?? p.caption ?? '').trim();
  return {
    id: p.id,
    caption: caption.length > 140 ? caption.slice(0, 137).trimEnd() + '…' : caption,
    href: p.permalink,
    imageSrc: p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl,
  };
}

/** Loads the latest Instagram posts from a Behold feed. Without a URL, returns `off`. */
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
