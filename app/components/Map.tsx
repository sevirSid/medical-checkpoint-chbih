'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { MedicalFacility } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MapProps {
  facilities: MedicalFacility[];
}

const MapComponent = ({ facilities }: MapProps) => {
  const { currentLanguage } = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize Leaflet icons
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  if (!mounted) return null;

  // Filter out facilities without valid coordinates
  const facilitiesWithCoords = facilities.filter(
    (f) => typeof f.latitude === 'number' && typeof f.longitude === 'number'
  );

  if (!facilitiesWithCoords.length) return null;

  const center = [
    facilitiesWithCoords[0].latitude as number,
    facilitiesWithCoords[0].longitude as number
  ] as [number, number];

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {facilitiesWithCoords.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude as number, facility.longitude as number] as [number, number]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-black">
                  {currentLanguage === 'ar' && facility.ar_name ? facility.ar_name : facility.name}
                </h3>
                <p className="text-gray-600">{facility.speciality}</p>
                <p className="text-gray-600">{facility.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;