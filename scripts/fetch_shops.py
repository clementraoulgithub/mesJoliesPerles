#!/usr/bin/env python3
"""Récupère les données publiques des boutiques Les Jolies Perles.

  python3 scripts/fetch_shops.py

Écrit :
  sources/ugm_shop.json       infos + 1re page de produits Un grand marché
  sources/ugm_reviews.json    tous les avis Un grand marché
  sources/etsy_recent.json    dernières fiches Etsy (flux RSS)
  sources/instagram.json      profil Instagram (compteurs, photo)
  sources/top_ventes.json     modèles les plus commentés (approximation des ventes)
  public/marque/              logo, bannière, photo de profil
  public/produits/            photos produits

Etsy bloque la lecture directe de la boutique (anti-robot) : seul le flux RSS
(10 dernières fiches) est accessible. Les avis et ventes Etsy demandent l'API
Etsy (clé développeur) ou un export manuel.
Instagram ne donne sans connexion que le profil (abonnés, publications, photo).
"""
import collections
import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'sources'
BRAND = ROOT / 'public' / 'marque'
PRODUCTS = ROOT / 'public' / 'produits'

UGM_SHOP = 'https://www.ungrandmarche.fr/boutique/les-jolies-perles'
UGM_SHOP_ID = 2775
ETSY_RSS = 'https://www.etsy.com/shop/Mesjoliesperles/rss'
INSTAGRAM = 'https://www.instagram.com/les_joliesperles/'

BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'


def get(url, data=None, ua=BROWSER, binary=False):
    req = urllib.request.Request(url, data=data, headers={'User-Agent': ua, 'Accept-Language': 'fr-FR,fr;q=0.9'})
    with urllib.request.urlopen(req, timeout=30) as r:
        body = r.read()
    return body if binary else body.decode('utf-8', 'replace')


def text(fragment):
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', fragment))).strip()


def download(url, dest):
    if dest.exists():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(get(url, binary=True))
    time.sleep(0.2)


def public_path(dest):
    return '/' + dest.relative_to(ROOT / 'public').as_posix()


# ───────────── Un grand marché ─────────────

def ugm_shop():
    s = get(UGM_SHOP)
    rating = re.search(r'"ratingValue":\s*"([\d.]+)",\s*"ratingCount":\s*"(\d+)"', s)
    stat = lambda label: int(re.search(label + r'\s*</[^>]+>\s*<[^>]+>\s*(\d+)', s).group(1)) if re.search(label + r'\s*</[^>]+>\s*<[^>]+>\s*(\d+)', s) else None
    logo = re.search(r'(https://[^"\' ?]*shop-logo/shop-logo-\d+\.jpeg)', s).group(1)
    banner = re.search(r'(https://[^"\' ?]*shop-banner/shop-banner-\d+\.jpeg)', s).group(1)
    desc = re.search(r'la passion, la création de bijoux fantaisie</[^>]+>(.*?)A bientôt', s, re.S)

    products = []
    for card in s.split('class="article-container')[1:]:
        link = re.search(r'<a href="(https://www.ungrandmarche.fr/boutiques/p/[^"]+/(\d+))" title="([^"]+)"', card)
        price = re.search(r'([\d]+,\d\d)\s*€', card)
        if not link:
            continue
        pid = link.group(2)
        img = re.search(r'(https://[^" ]*/' + pid + r'-[^" ]*?)_medium\.jpeg', card)
        products.append({'id': pid, 'name': html.unescape(link.group(3)), 'url': link.group(1),
                         'price': price.group(1) + ' €' if price else None,
                         'image': img.group(1) + '.jpeg' if img else None})

    info = {
        'url': UGM_SHOP,
        'name': 'Les Jolies Perles',
        'rating': float(rating.group(1)) if rating else None,
        'reviews': int(rating.group(2)) if rating else None,
        'sales': stat('Ventes finalisées'),
        'favorites': stat('Mises en favoris'),
        'since': (re.search(r'depuis\s*</[^>]+>\s*<[^>]+>\s*([\d/]+)', s) or [None, None])[1],
        'description': text(desc.group(1)) if desc else None,
        'facebook': (re.search(r'href="(https://www.facebook.com/Les-jolies-perles-\d+/)', s) or [None, None])[1],
        'pinterest': (re.search(r'social-items.*?href="(https://www.pinterest.fr/[^"]+)"', s, re.S) or [None, None])[1],
        'logo': logo, 'banner': banner,
        'products': products,
    }
    download(logo, BRAND / 'logo.jpeg')
    download(banner, BRAND / 'banniere.jpeg')
    return info


def ugm_reviews():
    out, page = [], 1
    while True:
        s = get(f'https://www.ungrandmarche.fr/avis/s/{UGM_SHOP_ID}', data=f'page={page}'.encode())
        blocks = s.split('class="rate question"')[1:]
        for b in blocks:
            author = re.search(r'<span class="by"><small>Par</small> <span>(.*?)</span>', b, re.S)
            date = re.search(r'Le (\d\d)/(\d\d)/(\d{4})', b)
            head = b.split('<small class="rose">')[0]
            body = re.search(r'<div class="clearfix"></div>\s*<p>(.*?)</p>', b, re.S)
            prod = re.search(r'id="title_product_(\d+)" class="rose" href="([^"]+)">(.*?)</a>', b)
            img = re.search(r'data-src="([^"]+les-jolies-perles/[^"]+)_medium\.jpeg"', b)
            out.append({
                'author': html.unescape(author.group(1).strip()) if author else None,
                'date': f'{date.group(3)}-{date.group(2)}-{date.group(1)}' if date else None,
                'rating': head.count('fa fa-star"'),
                'text': text(body.group(1)) if body else None,
                'product_id': prod.group(1) if prod else None,
                'product_url': prod.group(2) if prod else None,
                'product': html.unescape(prod.group(3)) if prod else None,
                'product_image': img.group(1) + '.jpeg' if img else None,
            })
        if len(blocks) < 5:
            return out
        page += 1
        time.sleep(0.3)


def model_family(name):
    n = name.lower().replace("boucles d'oreilles", '').strip()
    if 'créoles perles' in n and 'gabrielle' not in n and 'aurore' not in n:
        return 'Créoles perles en résine'
    word = re.split(r'[\s(]', n.strip())[0]
    return word.capitalize()


def top_sales(reviews, n=4):
    """Les ventes par article ne sont pas publiques : on classe les modèles par nombre d'avis."""
    families = collections.defaultdict(list)
    for r in reviews:
        if r['product']:
            families[model_family(r['product'])].append(r)
    ranked = sorted(families.items(), key=lambda kv: (len(kv[1]), kv[1][0]['date'] or ''), reverse=True)
    top = []
    for family, rs in ranked[:n]:
        best = collections.Counter(r['product_url'] for r in rs).most_common(1)[0][0]
        r = next(x for x in rs if x['product_url'] == best)
        page = get(best)
        price = re.search(r'"price":\s*"([\d.]+)"', page)
        stock = 'OutOfStock' not in (re.search(r'schema.org/(\w+Stock)', page) or [''])[0]
        dest = PRODUCTS / f"ugm-{r['product_id']}.jpeg"
        download(r['product_image'], dest)
        top.append({'family': family, 'reviews': len(rs), 'product': r['product'], 'url': best,
                    'price': price.group(1).replace('.', ',') + ' €' if price else None,
                    'in_stock': stock, 'image': public_path(dest)})
        time.sleep(0.3)
    return top


# ───────────── Etsy (flux RSS) ─────────────

def etsy_recent():
    s = get(ETSY_RSS)
    items = []
    for it in re.findall(r'<item>(.*?)</item>', s, re.S):
        title = html.unescape(html.unescape(re.search(r'<title>(.*?)</title>', it, re.S).group(1)))
        desc = html.unescape(re.search(r'<description>(.*?)</description>', it, re.S).group(1))
        link = re.search(r'<link>(.*?)</link>', it).group(1).split('?')[0]
        lid = re.search(r'/listing/(\d+)', link).group(1)
        img = re.search(r'<img src="([^"]+)"', desc).group(1)
        dest = PRODUCTS / f'etsy-{lid}.jpg'
        download(img, dest)
        items.append({
            'id': lid,
            'name': re.sub(r'\s+by Mesjoliesperles$', '', title),
            'url': link,
            'price': re.search(r'<p class="price">(.*?)</p>', desc).group(1).replace(' EUR', ' €'),
            'description': text(re.search(r'<p class="description">(.*?)</p>', desc, re.S).group(1)),
            'date': re.search(r'<pubDate>(.*?)</pubDate>', it).group(1),
            'image': public_path(dest),
            'image_source': img,
        })
    return items


# ───────────── Instagram (profil public) ─────────────

def instagram():
    # Instagram ne sert les balises og: qu'aux robots d'aperçu de lien.
    s = get(INSTAGRAM, ua='facebookexternalhit/1.1')
    meta = {k: html.unescape(v) for k, v in re.findall(r'<meta property="og:(\w+)" content="([^"]*)"', s)}
    counts = re.search(r'([\d,.\s]+) followers, ([\d,.\s]+) (?:following|suivis), ([\d,.\s]+) (?:posts|publications)',
                       meta.get('description', ''), re.I)
    num = lambda x: int(re.sub(r'\D', '', x))
    if meta.get('image'):
        download(meta['image'], BRAND / 'instagram.jpg')
    return {
        'url': INSTAGRAM, 'handle': '@les_joliesperles',
        'name': re.sub(r'\s*\(.*$', '', meta.get('title', '')),
        'followers': num(counts.group(1)) if counts else None,
        'following': num(counts.group(2)) if counts else None,
        'posts': num(counts.group(3)) if counts else None,
        'avatar': '/marque/instagram.jpg' if meta.get('image') else None,
    }


def save(name, data):
    SRC.mkdir(exist_ok=True)
    (SRC / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print('→', (SRC / name).relative_to(ROOT))


def main():
    shop = ugm_shop()
    save('ugm_shop.json', shop)
    reviews = ugm_reviews()
    save('ugm_reviews.json', reviews)
    save('top_ventes.json', top_sales(reviews))
    try:
        save('etsy_recent.json', etsy_recent())
    except Exception as e:  # Etsy peut refuser l'accès
        print('Etsy :', e, file=sys.stderr)
    try:
        save('instagram.json', instagram())
    except Exception as e:
        print('Instagram :', e, file=sys.stderr)


if __name__ == '__main__':
    main()
