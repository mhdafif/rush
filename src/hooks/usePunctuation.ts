import { useCallback, useState } from "react";

import { type Language, generateWords } from "../utils/generateWords";

export interface PunctuationOptions {
  punct: boolean;
  nums: boolean;
}

export function usePunctuation() {
  const [punct, setPunct] = useState(false);
  const [nums, setNums] = useState(false);

  const togglePunct = useCallback(() => setPunct((p) => !p), []);
  const toggleNums = useCallback(() => setNums((n) => !n), []);

  const generateWithOptions = useCallback(
    (
      count: number,
      lang: Language,
      override?: { punct?: boolean; nums?: boolean }
    ): string[] =>
      generateWords(count, lang, {
        punct: override?.punct ?? punct,
        nums: override?.nums ?? nums,
      }),
    [punct, nums]
  );

  return {
    punct,
    nums,
    setPunct,
    setNums,
    togglePunct,
    toggleNums,
    generateWithOptions,
  };
}
