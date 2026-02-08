
export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  timestamp: number;
  image: string;
  imageAttribution?: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  isBreaking?: boolean;
}

export enum GenreFilter {
  ALL = 'All',
  BREAKING = 'News',
  JAZZ = 'Jazz',
  CLASSICAL = 'Classical',
  INDIE = 'Indie',
  ELECTRONIC = 'Electronic',
  FOLK_AMERICANA = 'Folk/Americana',
  HIP_HOP_RB = 'Hip-Hop/R&B',
  WORLD = 'World',
  ROCK = 'Rock',
  GENERAL = 'General'
}

export enum MusicGenre {
  ALL = 'Wide Spectrum',
  ROCK = 'Rock',
  JAZZ = 'Jazz',
  FUNK = 'Funk',
  REGGAE = 'Reggae',
  GOSPEL = 'Gospel',
  FUSION = 'Fusion',
  TECHNO = 'Techno',
  BLUES = 'Blues',
  RB = 'R&B',
  SOUL = 'Soul',
  METAL = 'Metal',
  CLASSICAL = 'Classical',
  ELECTRONIC = 'Electronic',
  FOLK = 'Folk',
  COUNTRY = 'Country',
  DISCO = 'Disco',
  ATMOSPHERIC = 'Atmospheric',
  LOFI = 'Lo-Fi',
  CINEMATIC = 'Cinematic'
}

export interface Quote {
  text: string;
  author: string;
  translation?: string;
}

export interface SonicIdentity {
  quote: Quote;
  colors: string[];
  insight: string;
  bpm?: number;
}

export interface ArtistBio {
  name: string;
  biography: string[];
  portraitUrl: string;
  youtubeId: string;
  genre: string;
  location: string;
  achievements: string[];
  sources?: { uri: string; title: string }[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: MusicGenre;
  quotes: Quote[];
  audioUrl: string;
  albumArt?: string;
  isExternal?: boolean;
}

export interface StoreProduct {
  id: string;
  name: string;
  affiliateLink: string;
  brand: string;
  image: string;
  description?: string;
  specs?: string[];
}
