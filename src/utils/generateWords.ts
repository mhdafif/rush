import { wordList } from "./wordList";
import { wordListId } from "./wordListId";

export type Language = "en" | "id";

export interface WordGenOptions {
  punct?: boolean;
  nums?: boolean;
}

const lists: Record<Language, string[]> = {
  en: wordList as string[],
  id: wordListId,
};

const PUNCTUATION = [",", ".", "!", "?", ";", ":"];

function applyPunct(word: string): string {
  return word + PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
}

function randomNum(): string {
  const digits = Math.floor(Math.random() * 4) + 1; // 1–4 digits
  return String(Math.floor(Math.random() * Math.pow(10, digits)));
}

export function generateWords(
  count: number,
  lang: Language = "en",
  options: WordGenOptions = {}
): string[] {
  const { punct = false, nums = false } = options;
  const source = lists[lang];
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  const base: string[] = [];
  while (base.length < count) base.push(...shuffled);
  const raw = base.slice(0, count);

  return raw.map((word) => {
    // ~15% chance to replace with a number (if nums enabled)
    if (nums && Math.random() < 0.15) return randomNum();
    // ~25% chance to append punctuation (if punct enabled)
    if (punct && Math.random() < 0.25) return applyPunct(word);
    return word;
  });
}
