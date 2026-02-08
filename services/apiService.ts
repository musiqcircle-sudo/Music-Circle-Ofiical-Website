
import { MusicGenre, Track, NewsItem, ArtistBio, Quote, StoreProduct, GenreFilter } from "../types";

const BANNED_KEYWORDS = [
  'politics', 'election', 'trump', 'biden', 'congress', 'senate', 'legislation', 'government', 
  'war', 'conflict', 'vaccine', 'covid', 'policy', 'court', 'supreme court', 'republican', 'democrat',
  'protest', 'lawsuit', 'official', 'department', 'border', 'immigration', 'economy', 'inflation'
];

const DEATH_KEYWORDS = [
  'died', 'death', 'passes away', 'passing', 'obituary', 'memorial', 'tribute to the late', 
  'rest in peace', 'in memory of', 'loss of the legendary', 'mourns', 'deceased', 'dead at', 'killed'
];

const LOW_RES_SIGNATURES = [
  '150x150', '100x100', '75x75', '300x200', '300x300', 'thumbnail', 'square', 'avatar', 'icon',
  'placeholder', 'lowres', 'tiny', 'size=s', 'size=m', 'w=150', 'w=300', 'h=150', 'h=300',
  'fit=crop&w=100', 'fit=crop&w=300', 'resize=150', 'resize=300', 'small', 'medium', '400x', '120x'
];

const RSS_SOURCES = [
  { url: 'https://www.musicrow.com/feed/', name: 'MusicRow', defaultCategory: GenreFilter.FOLK_AMERICANA },
  { url: 'https://www.allaboutjazz.com/rss.xml', name: 'All About Jazz', defaultCategory: GenreFilter.JAZZ },
  { url: 'https://www.allbutforgottenoldies.net/rss/artist-of-the-day.xml', name: 'Oldies Archive', defaultCategory: GenreFilter.ROCK },
  { url: 'https://hiphopwired.com/feed/', name: 'HipHopWired', defaultCategory: GenreFilter.HIP_HOP_RB },
  { url: 'https://okayplayer.com/feeds/feed.rss', name: 'OkayPlayer', defaultCategory: GenreFilter.HIP_HOP_RB },
  { url: 'https://uproxx.com/music/feed', name: 'UPROXX', defaultCategory: GenreFilter.GENERAL },
  { url: 'https://www.rollingstone.com/music/feed/', name: 'Rolling Stone', defaultCategory: GenreFilter.GENERAL },
  { url: 'https://opac.rism.info/news/rss.xml', name: 'RISM', defaultCategory: GenreFilter.CLASSICAL }
];

const CACHE_NEWS_KEY = 'music_circle_live_editorial_v5';
const CACHE_ARTIST_KEY = 'music_circle_artist_day_v5';
const CACHE_TTL = 15 * 60 * 1000; 

const decodeHtml = (html: string): string => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.documentElement.textContent || "").trim();
};

const cleanContent = (html: string): string => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const removals = doc.querySelectorAll('script, style, a.more-link, .feed-ignore, .wp-caption-text, .ad-unit, .sharedaddy');
  removals.forEach(el => el.remove());
  let cleaned = doc.body.textContent || "";
  cleaned = cleaned.replace(/\[\.\.\.\]/g, '').replace(/The post .* appeared first on .*/gi, '').replace(/\s+/g, ' ').trim();
  return decodeHtml(cleaned);
};

const getFidelityScore = (url: string, width?: string | null, height?: string | null): number => {
  if (!url || url.length < 15) return -1;
  const lowerUrl = url.toLowerCase();
  if (LOW_RES_SIGNATURES.some(sig => lowerUrl.includes(sig))) return -1;
  if (width && parseInt(width) < 600) return -1;
  return 500000;
};

const fetchWithProxy = async (targetUrl: string): Promise<string> => {
  const encoded = encodeURIComponent(targetUrl);
  const proxies = [
    `https://corsproxy.io/?${targetUrl}`,
    `https://api.allorigins.win/get?url=${encoded}`
  ];
  for (const proxy of proxies) {
    try {
      const resp = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
      if (resp.ok) {
        if (proxy.includes('allorigins')) return (await resp.json()).contents;
        return await resp.text();
      }
    } catch (e) {}
  }
  return "";
};

const extractImageUrl = (item: Element, contentHtml: string): string | null => {
  const candidateAssets: { url: string; score: number }[] = [];

  Array.from(item.getElementsByTagName('media:content')).forEach(node => {
    const url = node.getAttribute('url') || "";
    const score = getFidelityScore(url, node.getAttribute('width'), node.getAttribute('height'));
    if (score > 0) candidateAssets.push({ url, score });
  });

  const enclosure = item.querySelector('enclosure[type^="image"]');
  if (enclosure) {
    const url = enclosure.getAttribute('url') || "";
    const score = getFidelityScore(url);
    if (score > 0) candidateAssets.push({ url, score });
  }

  if (candidateAssets.length === 0) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentHtml;
    tempDiv.querySelectorAll('img').forEach(img => {
      const url = img.getAttribute('src') || "";
      const score = getFidelityScore(url);
      if (score > 0) candidateAssets.push({ url, score: 300000 });
    });
  }

  const winner = candidateAssets.sort((a, b) => b.score - a.score)[0];
  return winner ? winner.url : null;
};

const autoTag = (title: string, desc: string, defaultCat: GenreFilter): GenreFilter => {
  const content = (title + ' ' + desc).toLowerCase();
  
  // Specificity rules for accurate genre filtering
  if (content.match(/orchestra|symphony|opera|violin|piano|mozart|beethoven|bach|classical|anniversary/i)) return GenreFilter.CLASSICAL;
  if (content.match(/jazz|sax|trumpet|bebop|swing|improvisation|fusion|quintet/i)) return GenreFilter.JAZZ;
  if (content.match(/rap|rapper|hip hop|hiphop|mc|trap|drill|beatmaker|soul|r&b|rnb/i)) return GenreFilter.HIP_HOP_RB;
  if (content.match(/country|bluegrass|acoustic|banjo|songwriter|nashville|folk|americana/i)) return GenreFilter.FOLK_AMERICANA;
  if (content.match(/rock|metal|punk|guitar|distortion|band/i)) return GenreFilter.ROCK;
  if (content.match(/techno|house|electronic|synth|ambient|dj/i)) return GenreFilter.ELECTRONIC;
  if (content.match(/indie|alternative|bedroom pop/i)) return GenreFilter.INDIE;
  
  return defaultCat;
};

export const fetchMusicNews = async (): Promise<NewsItem[]> => {
  const cached = localStorage.getItem(CACHE_NEWS_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) return data;
  }

  const sourceGroups: Record<string, NewsItem[]> = {};
  RSS_SOURCES.forEach(s => sourceGroups[s.name] = []);

  const fetchPromises = RSS_SOURCES.map(async (source) => {
    try {
      const xml = await fetchWithProxy(source.url);
      if (!xml) return;
      const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
      const items = Array.from(xmlDoc.querySelectorAll('item'));
      
      for (const item of items) {
        const title = decodeHtml((item.querySelector('title')?.textContent || '').trim());
        const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent || '';
        const rawDescription = item.querySelector('description')?.textContent || '';
        const description = cleanContent(contentEncoded || rawDescription);

        if (title.length < 5 || description.length < 100) continue;
        if (BANNED_KEYWORDS.some(k => (title + description).toLowerCase().includes(k))) continue;

        const imageUrl = extractImageUrl(item, contentEncoded || rawDescription);
        if (!imageUrl) continue;

        const link = (item.querySelector('link')?.textContent || '').trim();
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const timestamp = new Date(pubDate).getTime() || Date.now();
        const isBreaking = DEATH_KEYWORDS.some(k => title.toLowerCase().includes(k));

        sourceGroups[source.name].push({
          id: `${source.name}-${timestamp}-${title.substring(0, 10)}`,
          title,
          category: isBreaking ? GenreFilter.BREAKING : autoTag(title, description, source.defaultCategory),
          isBreaking,
          date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
          timestamp,
          image: imageUrl,
          description,
          sourceName: source.name,
          sourceUrl: link
        });
      }
    } catch (e) {}
  });

  await Promise.allSettled(fetchPromises);

  // DIVERSITY & PRIORITY LOGIC
  // 1. Extract and prioritize Breaking News
  const breakingNews: NewsItem[] = [];
  Object.keys(sourceGroups).forEach(sourceName => {
    const breakingFromSource = sourceGroups[sourceName].filter(i => i.isBreaking);
    breakingNews.push(...breakingFromSource);
    sourceGroups[sourceName] = sourceGroups[sourceName].filter(i => !i.isBreaking);
  });
  breakingNews.sort((a, b) => b.timestamp - a.timestamp);

  // 2. Interleave Regular News (Round Robin)
  const regularNews: NewsItem[] = [];
  const activeSources = Object.keys(sourceGroups).filter(name => sourceGroups[name].length > 0);
  
  activeSources.forEach(name => {
    sourceGroups[name].sort((a, b) => b.timestamp - a.timestamp);
  });

  let index = 0;
  let hasMore = true;
  const seenSlugs = new Set();

  while (hasMore && regularNews.length < 60) {
    hasMore = false;
    for (const sourceName of activeSources) {
      const item = sourceGroups[sourceName][index];
      if (item) {
        hasMore = true;
        const slug = item.title.toLowerCase().substring(0, 30);
        if (!seenSlugs.has(slug)) {
          regularNews.push(item);
          seenSlugs.add(slug);
        }
      }
    }
    index++;
  }

  // 3. Construct Final Sequence: BREAKING ALWAYS FIRST
  const final = [...breakingNews, ...regularNews].slice(0, 48);

  if (final.length > 0) {
    localStorage.setItem(CACHE_NEWS_KEY, JSON.stringify({ data: final, timestamp: Date.now() }));
  }
  return final;
};

export const fetchArtistBio = async (): Promise<ArtistBio> => {
  const cached = localStorage.getItem(CACHE_ARTIST_KEY);
  const today = new Date().toDateString();
  if (cached) {
    const { data, date } = JSON.parse(cached);
    if (date === today) return data;
  }

  const news = await fetchMusicNews();
  // Find a feature/profile source specifically for Artist of the Day
  const featureSources = ['Oldies Archive', 'All About Jazz', 'MusicRow', 'OkayPlayer'];
  const artistEntry = news.find(n => featureSources.includes(n.sourceName)) || news[0];

  let youtubeId: string | undefined = undefined;
  if (artistEntry.description.toLowerCase().includes('video') || artistEntry.title.toLowerCase().includes('music circle')) {
    youtubeId = 'rYEDA3JcQqw'; 
  }

  const artist: ArtistBio = {
    name: artistEntry.title.split(/[:|-]/)[0].trim(),
    biography: artistEntry.description.split('. ').slice(0, 4).map(s => s + '.'),
    portraitUrl: artistEntry.image,
    youtubeId: youtubeId as any,
    genre: artistEntry.category,
    location: 'World Broadcast',
    achievements: ['Featured Editorial Profile', artistEntry.sourceName + ' Selection'],
    sources: [{ uri: artistEntry.sourceUrl, title: artistEntry.sourceName }]
  };

  localStorage.setItem(CACHE_ARTIST_KEY, JSON.stringify({ data: artist, date: today }));
  return artist;
};

export const fetchQuote = async (): Promise<Quote> => {
  const news = await fetchMusicNews();
  const randomNews = news[Math.floor(Math.random() * news.length)];
  return {
    text: randomNews.title,
    author: randomNews.sourceName
  };
};

export const fetchVaultInstruments = async (): Promise<Record<string, StoreProduct[]>> => {
  return {
    "Classic Selection": [
      { id: '1', name: 'Gibson Les Paul Standard', brand: 'Gibson', affiliateLink: 'https://amzn.to/3P1', image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=1000', description: 'The gold standard of rock and roll.' },
      { id: '2', name: 'Fender Stratocaster', brand: 'Fender', affiliateLink: 'https://amzn.to/3P2', image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=1000', description: 'Versatility in a legendary body shape.' }
    ],
    "Studio Essentials": [
      { id: '3', name: 'Akai MPC Live II', brand: 'Akai', affiliateLink: 'https://amzn.to/3P3', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000', description: 'Standalone beatmaking powerhouse.' }
    ]
  };
};

export const searchMusic = async (q: string): Promise<Track[]> => {
  const news = await fetchMusicNews();
  return news.filter(n => n.title.toLowerCase().includes(q.toLowerCase())).map(n => ({
    id: n.id,
    title: n.title,
    artist: n.sourceName,
    album: n.category,
    genre: MusicGenre.ELECTRONIC,
    quotes: [],
    audioUrl: '',
    albumArt: n.image
  }));
};
