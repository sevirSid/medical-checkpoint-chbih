export interface MedicalFacility {
  id: string;
  name: string;
  type: string;
  speciality: string;
  city: string;
  phone: string;
  latitude: number | string;
  longitude: number | string;
  ar_name?: string;
}

export interface FilterState {
  type: string;
  speciality: string;
  city: string;
}