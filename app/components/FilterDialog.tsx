'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { FilterState } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { facilities } from '../data/facilities';

interface FilterDialogProps {
  filters: FilterState;
  onFilter: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterDialog({ filters, onFilter, onReset }: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const { t, currentLanguage } = useTranslations();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Get unique values for each filter
  const types = Array.from(new Set(facilities.map(f => f.type))).filter(Boolean);
  const specialities = Array.from(new Set(facilities.map(f => f.speciality))).filter(Boolean);
  const cities = Array.from(new Set(facilities.map(f => f.city))).filter(Boolean);

  const handleFilter = () => {
    onFilter(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetState = { type: '', speciality: '', city: '' };
    setLocalFilters(resetState);
    onFilter(resetState);
    onReset();
    setOpen(false);
  };

  const hasActiveFilters = filters.type || filters.speciality || filters.city;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 ${hasActiveFilters ? 'bg-[#30a2b7]' : 'bg-[#c69b5f]'} text-white hover:bg-[#5e4522] border-none`}
        >
          <Filter className="w-4 h-4" />
          {t('filter')}
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#001c23] border-[#30a2b7] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#c69b5f]">{t('filterFacilities')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4" style={{ direction: currentLanguage === 'ar' ? 'rtl' : 'ltr' }}>
          <Select
            value={localFilters.type}
            onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="bg-[#0d6574]/20 border-[#30a2b7] text-white">
              <SelectValue placeholder={t('selectType')} />
            </SelectTrigger>
            <SelectContent className="bg-[#001c23] border-[#30a2b7]">
              <SelectItem value="_all" className="text-white hover:bg-[#0d6574]">{t('all')}</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type} className="text-white hover:bg-[#0d6574]">
                  {t(`types.${type.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={localFilters.speciality}
            onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, speciality: value }))}
          >
            <SelectTrigger className="bg-[#0d6574]/20 border-[#30a2b7] text-white">
              <SelectValue placeholder={t('selectSpeciality')} />
            </SelectTrigger>
            <SelectContent className="bg-[#001c23] border-[#30a2b7]">
              <SelectItem value="_all" className="text-white hover:bg-[#0d6574]">{t('all')}</SelectItem>
              {specialities.map(speciality => (
                <SelectItem key={speciality} value={speciality} className="text-white hover:bg-[#0d6574]">
                  {t(`specialities.${speciality.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={localFilters.city}
            onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, city: value }))}
          >
            <SelectTrigger className="bg-[#0d6574]/20 border-[#30a2b7] text-white">
              <SelectValue placeholder={t('selectCity')} />
            </SelectTrigger>
            <SelectContent className="bg-[#001c23] border-[#30a2b7]">
              <SelectItem value="_all" className="text-white hover:bg-[#0d6574]">{t('all')}</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city} className="text-white hover:bg-[#0d6574]">
                  {t(`cities.${city.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleReset} variant="outline" className="border-[#30a2b7] text-white hover:bg-[#0d6574]">
            <X className="w-4 h-4 mr-2" />
            {t('reset')}
          </Button>
          <Button onClick={handleFilter} className="bg-[#c69b5f] text-white hover:bg-[#5e4522]">
            {t('apply')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}