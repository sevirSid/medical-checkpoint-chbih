'use client';

import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';

interface ViewToggleProps {
  view: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useTranslations();

  return (
    <div className="flex gap-2 bg-[#0d6574]/20 p-1 rounded-lg">
      <Button
        variant={view === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('map')}
        className={view === 'map' ? 'bg-[#30a2b7]' : 'hover:bg-[#30a2b7]/20'}
      >
        <Map className="w-4 h-4 mr-2" />
        {t('map')}
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={view === 'list' ? 'bg-[#30a2b7]' : 'hover:bg-[#30a2b7]/20'}
      >
        <List className="w-4 h-4 mr-2" />
        {t('list')}
      </Button>
    </div>
  );
}