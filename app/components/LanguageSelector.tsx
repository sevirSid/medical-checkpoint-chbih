'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '../hooks/useTranslations';
import { useEffect } from 'react';
import type { Language } from '../translations/types';

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, isRTL } = useTranslations();

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage, isRTL]);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && isValidLanguage(savedLang)) {
      changeLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    if (isValidLanguage(value)) {
      changeLanguage(value);
      window.dispatchEvent(new Event('languagechange'));
    }
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[100px] bg-[#0d6574]/20 border-[#30a2b7] text-white">
        <SelectValue>
          {currentLanguage === 'fr' ? 'Français' : 
           currentLanguage === 'en' ? 'English' : 
           'العربية'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-[#001c23] border-[#30a2b7]">
        <SelectItem value="fr" className="text-white hover:bg-[#0d6574]">Français</SelectItem>
        <SelectItem value="en" className="text-white hover:bg-[#0d6574]">English</SelectItem>
        <SelectItem value="ar" className="text-white hover:bg-[#0d6574]">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}

function isValidLanguage(lang: string): lang is Language {
  return ['fr', 'en', 'ar'].includes(lang);
}