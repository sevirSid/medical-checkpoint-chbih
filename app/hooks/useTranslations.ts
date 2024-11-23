'use client';

import { create } from 'zustand';
import { translations } from '../translations';
import type { Language, TranslationsStore } from '../translations/types';

type LanguageStore = {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
};

const useLanguageStore = create<LanguageStore>((set) => ({
  currentLanguage: 'fr',
  changeLanguage: (lang: Language) => set({ currentLanguage: lang }),
}));

export function useTranslations() {
  const { currentLanguage, changeLanguage } = useLanguageStore();
  const isRTL = currentLanguage === 'ar';

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = (translations as TranslationsStore)[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce(
        (acc, [key, val]) => acc.replace(`{${key}}`, val),
        value
      );
    }

    return value || key;
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isRTL
  };
}