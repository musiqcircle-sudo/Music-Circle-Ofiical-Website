
import { GoogleGenAI, Type } from "@google/genai";
import { MusicGenre, Track, NewsItem, ArtistBio, Quote, StoreProduct } from "../types";

const safeJsonParse = (text: string | undefined) => {
  if (!text) return null;
  try {
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (match && match[0]) return JSON.parse(match[0]);
    return null;
  }
};

async function attempt<T>(providers: (() => Promise<T>)[], fallback: T): Promise<T> {
  for (const provider of providers) {
    try {
      return await provider();
    } catch (e) {
      console.warn("Provider failed, attempting next...");
    }
  }
  return fallback;
}

export const fetchQuote = async (): Promise<Quote> => {
  return attempt<Quote>([
    async () => {
      const res = await fetch('https://api.quotable.io/random?tags=wisdom,music,inspirational');
      const data = await res.json();
      return { text: data.content.toUpperCase(), author: data.author };
    }
  ], { text: "MUSIC IS THE DIVINE WAY TO TELL BEAUTIFUL, POETIC THINGS TO THE HEART.", author: "Pablo Casals" });
};

export const fetchMusicNews = async (): Promise<NewsItem[]> => {
  return attempt<NewsItem[]>([
    async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Retrieve 8 current REAL music news items from Billboard, Rolling Stone, or Pitchfork. 
        CRITICAL: Identify if any story is actual 'BREAKING NEWS' of a serious nature (e.g., the passing of a musician, a major artist's unexpected departure, or a massive global industry shock). 
        Set a property 'isBreaking' as true ONLY for these high-priority, serious items. 
        For each story: title, category, sourceName, sourceUrl. 
        Find the ACTUAL high-res image URL (CDN links or official press photos). 
        Return as a JSON array.`,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      const data = safeJsonParse(response.text);
      if (!data) return [];
      return data.map((it: any, i: number) => ({
        id: `news-${i}`,
        title: it.title.toUpperCase(),
        category: it.category || 'PULSE',
        date: 'VERIFIED TRANSMISSION',
        image: it.image,
        description: it.description || "Official frequency report from the global audio network.",
        sourceName: it.sourceName,
        sourceUrl: it.sourceUrl,
        isBreaking: !!it.isBreaking
      }));
    }
  ], []);
};

export const fetchArtistBio = async (name?: string): Promise<ArtistBio> => {
  const query = name || "A top trending global music icon";
  return attempt<ArtistBio>([
    async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate a verified profile for: ${query}. 
        Find their ACTUAL high-res official press portrait URL. 
        Bio must be 3-4 professional sentences. 
        Achievement list must be historically accurate.
        YouTubeID must be from the 'Music Circle' official channel or a high-quality official live performance if unavailable.
        Return as JSON: { name, biography: [], portraitUrl, youtubeId, genre, location, achievements: [] }`,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      return safeJsonParse(response.text);
    }
  ], {
    name: "SONIC ARCHITECT",
    biography: ["A master of atmospheric frequencies."],
    portraitUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=90&w=2000",
    youtubeId: "",
    genre: "Ambient",
    location: "Global",
    achievements: ["Circle Certified"]
  });
};

export const searchMusic = async (query: string): Promise<Track[]> => {
  const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=24`);
  const data = await res.json();
  return data.results.map((item: any) => ({
    id: item.trackId.toString(),
    title: item.trackName.toUpperCase(),
    artist: item.artistName.toUpperCase(),
    album: item.collectionName,
    genre: MusicGenre.ALL,
    audioUrl: item.previewUrl,
    albumArt: item.artworkUrl100.replace('100x100', '800x800'),
    isExternal: true,
    quotes: []
  }));
};

export const fetchVaultInstruments = async (): Promise<Record<string, StoreProduct[]>> => {
  const CATALOG = [
    { name: "Yamaha REFACE CP", link: "https://amzn.to/3w9zw4u", cat: "Keyboards", brand: "Yamaha" },
    { name: "Moog Sub 37", link: "https://amzn.to/3ko9fwV", cat: "Keyboards", brand: "Moog" },
    { name: "Nord Stage 3", link: "https://amzn.to/3IW20q0", cat: "Keyboards", brand: "Nord" },
    { name: "Squier Bullet Telecaster", link: "https://amzn.to/3w9Yr8b", cat: "Guitars", brand: "Squier" },
    { name: "Epiphone SG", link: "https://amzn.to/3XfKVf8", cat: "Guitars", brand: "Epiphone" },
    { name: "Eastar Alto Saxophone", link: "https://amzn.to/3m8vw2H", cat: "Saxophones", brand: "Eastar" },
    { name: "Cecilio 4/4 Full Size Cello", link: "https://amzn.to/3NCzRZE", cat: "Cellos", brand: "Cecilio" }
  ];

  return attempt<Record<string, StoreProduct[]>>([
    async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Enrich this musical gear list with ACTUAL professional product photography URLs. 
        STRICT: Use official site images or high-quality retailer URLs that allow hotlinking. 
        List: ${JSON.stringify(CATALOG)}. 
        Include a 2-sentence professional description and 3 technical specs for each. 
        Group by category in the JSON output.`,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      return safeJsonParse(response.text);
    }
  ], {});
};
