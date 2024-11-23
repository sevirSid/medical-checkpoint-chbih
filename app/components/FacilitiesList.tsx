'use client';

import { useState } from 'react';
import { MapPin, Phone, Navigation, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicalFacility } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import ScrollToTop from './ScrollToTop';

interface FacilitiesListProps {
  facilities: MedicalFacility[];
}

export default function FacilitiesList({ facilities }: FacilitiesListProps) {
  const { t, currentLanguage } = useTranslations();
  const [displayCount, setDisplayCount] = useState(9);
  
  const showMore = () => {
    setDisplayCount(prev => prev + 9);
  };

  const openDirections = (facility: MedicalFacility) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS
      ? `maps://maps.apple.com/?daddr=${facility.latitude},${facility.longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;
    window.open(url, '_blank');
  };

  const openWhatsApp = (facility: MedicalFacility, type: 'phone' | 'location') => {
    const facilityName = currentLanguage === 'ar' && facility.ar_name ? facility.ar_name : facility.name;
    const message = type === 'phone'
      ? `Hello, I have information about the phone number for ${facilityName} (ID: ${facility.id})`
      : `Hello, I have information about the location for ${facilityName} (ID: ${facility.id})`;
    const whatsappUrl = `https://wa.me/+22242285899?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isLocationMissing = (facility: MedicalFacility) => {
    return !facility.latitude ||
           !facility.longitude ||
           facility.latitude === 0 ||
           facility.longitude === 0 ||
           facility.latitude === "" ||
           facility.longitude === "";
  };

  const isPhoneMissing = (facility: MedicalFacility) => {
    return !facility.phone || facility.phone === "" || facility.phone === "informez nous";
  };

  const resultsText = t('resultsCount').replace('{count}', facilities.length.toString());

  return (
    <div>
      <div className="mb-4 text-white/80">
        {resultsText}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.slice(0, displayCount).map((facility) => (
          <div key={facility.id} className="card">
            <h3 className="card-title">
              {currentLanguage === 'ar' && facility.ar_name ? facility.ar_name : facility.name}
            </h3>
            <p className="card-text mb-4">
              {t(`specialities.${facility.speciality.toLowerCase()}`)} • {t(`types.${facility.type.toLowerCase()}`)}
            </p>
            
            {/* Phone Information */}
            <div className="flex items-center gap-2 text-[#30a2b7] mb-2">
              <Phone className="w-4 h-4" />
              {!isPhoneMissing(facility) ? (
                <a href={`tel:${facility.phone}`} className="hover:underline">
                  {facility.phone}
                </a>
              ) : (
                <Button
                  variant="link"
                  className="text-[#30a2b7] p-0 h-auto font-normal hover:text-[#0d6574]"
                  onClick={() => openWhatsApp(facility, 'phone')}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Inform us via WhatsApp
                </Button>
              )}
            </div>

            {/* Location Information */}
            <div className="flex items-center gap-2 text-white/60">
              <MapPin className="w-4 h-4 text-[#c69b5f]" />
              <span>{t(`cities.${facility.city.toLowerCase()}`)}</span>
            </div>

            {/* Directions Button */}
            {!isLocationMissing(facility) ? (
              <Button 
                onClick={() => openDirections(facility)}
                className="mt-4 w-full bg-[#30a2b7] hover:bg-[#0d6574] text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t('getDirections')}
              </Button>
            ) : (
              <Button 
                onClick={() => openWhatsApp(facility, 'location')}
                className="mt-4 w-full bg-[#30a2b7] hover:bg-[#0d6574] text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Help us add location
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {facilities.length > displayCount && (
        <div className="mt-8 text-center">
          <Button 
            onClick={showMore}
            className="bg-[#c69b5f] text-white hover:bg-[#5e4522]"
          >
            {t('loadMore')}
          </Button>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}