export interface Translations {
  title: string;
  description: string;
  searchPlaceholder: string;
  filter: string;
  filterFacilities: string;
  selectType: string;
  selectSpeciality: string;
  selectCity: string;
  all: string;
  apply: string;
  reset: string;
  map: string;
  list: string;
  loadMore: string;
  getDirections: string;
  resultsCount: string;
  facility: string;
  speciality: string;
  city: string;
  type: string;
  footer: string;
  resetAll: string;
  types: {
    [key: string]: string;
  };
  specialities: {
    [key: string]: string;
  };
  cities: {
    [key: string]: string;
  };
}

export interface TranslationsStore {
  fr: Translations;
  en: Translations;
  ar: Translations;
}

export type Language = 'fr' | 'en' | 'ar';