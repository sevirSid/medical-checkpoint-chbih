'use client';

import { useState, useEffect } from 'react';
import { MapPin, RotateCcw, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { facilities } from './data/facilities';
import FilterDialog from './components/FilterDialog';
import SearchBar from './components/SearchBar';
import LanguageSelector from './components/LanguageSelector';
import ViewToggle from './components/ViewToggle';
import FacilitiesList from './components/FacilitiesList';
import { Button } from '@/components/ui/button';
import { MedicalFacility, FilterState } from './types';
import { useTranslations } from './hooks/useTranslations';

const Map = dynamic(
  () => import('./components/Map').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

export default function Home() {
  const { t, currentLanguage, isRTL } = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    speciality: '',
    city: '',
  });
  const [view, setView] = useState<'map' | 'list'>('list');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY < 100;
      if (show !== isHeaderVisible) setIsHeaderVisible(show);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeaderVisible]);

  const filteredFacilities = facilities.filter((facility) => {
    const name =
      currentLanguage === 'ar' && facility.ar_name
        ? facility.ar_name
        : facility.name;

    const matchesSearch = searchQuery
      ? name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.type.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesType =
      !filters.type ||
      filters.type === '_all' ||
      facility.type === filters.type;
    const matchesSpeciality =
      !filters.speciality ||
      filters.speciality === '_all' ||
      facility.speciality === filters.speciality;
    const matchesCity =
      !filters.city ||
      filters.city === '_all' ||
      facility.city === filters.city;

    return matchesSearch && matchesType && matchesSpeciality && matchesCity;
  });

  const resetAll = () => {
    setSearchQuery('');
    setFilters({ type: '', speciality: '', city: '' });
  };

  const hasActiveFilters =
    searchQuery || filters.type || filters.speciality || filters.city;

  return (
    <main className="min-h-screen" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#001c23]/95 backdrop-blur-sm border-b border-[#30a2b7]/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {isRTL ? <LanguageSelector /> : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c69b5f] rounded overflow-hidden">
                <Image
                  src="/images/kinross-tasiaset.jpg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-[#c69b5f] font-semibold text-lg">
                Medical Checkpoints
              </span>
            </div>
          )}
          {isRTL ? (
            <div className="flex items-center gap-3">
              <span className="text-[#c69b5f] font-semibold text-lg">
                نقاط الفحص الطبي
              </span>
              <div className="w-8 h-8 bg-[#c69b5f] rounded overflow-hidden">
                <Image
                  src="/images/kinross-tasiaset.jpg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <LanguageSelector />
          )}
        </div>
      </nav>

      {/* Header with background image and animation */}
      <header className="relative py-32 px-4 overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/header-bg.jpg"
            alt="Kinross Tasiast"
            fill
            className={`object-cover transition-transform duration-1000 ${
              isHeaderVisible ? 'scale-100' : 'scale-110'
            }`}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001c23]/90 to-[#0d6574]/80" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-[#c69b5f] rounded-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#c69b5f] mb-2">
                {t('title')}
              </h1>
              <p className="text-white/80 max-w-2xl">{t('description')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-8 px-4 bg-[#001c23]/95 sticky top-16 z-40 backdrop-blur-sm border-b border-[#30a2b7]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <SearchBar
                value={searchQuery}
                onSearch={setSearchQuery}
                onReset={() => setSearchQuery('')}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="hover:bg-[#30a2b7]/20"
                >
                  <X className="w-4 h-4 text-white" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <FilterDialog
                filters={filters}
                onFilter={setFilters}
                onReset={() =>
                  setFilters({ type: '', speciality: '', city: '' })
                }
              />
              <ViewToggle view={view} onViewChange={setView} />
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetAll}
                  className="border-[#30a2b7] text-white hover:bg-[#0d6574]"
                  title={t('resetAll')}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {view === 'map' ? (
            <Map facilities={filteredFacilities} />
          ) : (
            <FacilitiesList facilities={filteredFacilities} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 px-4 bg-[#0d6574]/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">{t('footer')}</p>
        </div>
      </footer>
    </main>
  );
}