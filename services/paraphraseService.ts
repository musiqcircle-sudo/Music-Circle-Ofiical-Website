/**
 * Paraphrasing service is currently disabled.
 * The application has reverted to using original source text from RSS feeds.
 */
export const initParaphraser = async () => {};
export const paraphrase = async (text: string): Promise<string> => text;
export const paraphraseBatch = async (texts: string[]): Promise<string[]> => texts;