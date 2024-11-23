'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { facilities } from '../data/facilities';
import { useTranslations } from '../hooks/useTranslations';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  onReset: () => void;
}

export default function SearchBar({ value, onSearch, onReset }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { t, currentLanguage } = useTranslations();

  const updateSuggestions = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const suggestionSet = new Set<string>();

    facilities.forEach(facility => {
      const name = currentLanguage === 'ar' && facility.ar_name ? facility.ar_name : facility.name;
      if (name.toLowerCase().includes(query)) {
        suggestionSet.add(name);
      }
      if (facility.speciality.toLowerCase().includes(query)) {
        suggestionSet.add(t(`specialities.${facility.speciality.toLowerCase()}`));
      }
      if (facility.city.toLowerCase().includes(query)) {
        suggestionSet.add(t(`cities.${facility.city.toLowerCase()}`));
      }
      if (facility.type.toLowerCase().includes(query)) {
        suggestionSet.add(t(`types.${facility.type.toLowerCase()}`));
      }
    });

    setSuggestions(Array.from(suggestionSet).slice(0, 5));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSearch(newValue);
    updateSuggestions(newValue);
    setShowSuggestions(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            updateSuggestions(value);
            setShowSuggestions(true);
          }}
          placeholder={t('searchPlaceholder')}
          className="pl-10 bg-[#0d6574]/20 border-[#30a2b7] text-white placeholder-white/60"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute w-full mt-1 bg-[#001c23] border border-[#30a2b7] rounded-lg shadow-lg overflow-hidden z-[100]"
          style={{ direction: currentLanguage === 'ar' ? 'rtl' : 'ltr' }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-3 cursor-pointer hover:bg-[#0d6574] text-white"
              onClick={() => {
                onSearch(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}