export type CandidateType = 'Gobernador' | 'Alcalde Provincial' | 'Alcalde Distrital';

export interface Candidate {
  id: string;
  photoUrl: string;
  name: string;
  dni: string;
  nickname: string;
  partyId: string;
  isAffiliated: boolean;
  facebookUrl: string;
  tiktokUrl: string;
  position: 'gobernador' | 'alcalde_provincial' | 'alcalde_distrital';
  ranking?: number; // Optional, for governor
  provinceId?: string; // For provincial mayor
  districtId?: string; // For district mayor
}

export interface District {
  id: string;
  name: string;
  voters: number;
}

export interface Province {
  id: string;
  name: string;
  voters: number;
  districts: District[];
}

export interface Party {
  id: string;
  name: string;
  symbolUrl: string;
  type: 'Nuevo' | 'Tradicional';
}

export interface AgendaItem {
  id: string;
  description: string;
  date: string;
  link: string;
}

export interface OtherPartyActivity {
  id: string;
  partyId: string;
  description: string;
  link: string;
}

export interface SituationalStatusData {
  ancashVoters: number;
  parties: Party[];
  candidates: Candidate[];
  provinces: Province[];
  otherActivities: OtherPartyActivity[];
}

// Types for Regional Body Tab
export interface Official {
  id: string;
  name: string;
  position: string;
  dni: string;
}

export interface Counselor {
  id: string;
  name: string;
  dni: string;
  facebookUrl: string;
  tiktokUrl: string;
  quotaGender: 'Femenino' | 'Masculino' | '';
  quotaCommunity: boolean;
  isAffiliated: boolean;
  role: 'Titular' | 'Accesitario';
  phone: string;
}

export interface MayorCandidate {
  id: string;
  name: string;
  nickname: string;
  dni: string;
  facebookUrl: string;
  tiktokUrl: string;
  isAffiliated: boolean;
  gender: 'Femenino' | 'Masculino';
  phone: string;
  councilors: Counselor[];
}

export interface RegionalDistrict {
  id: string;
  name: string;
  voters: number;
  mayor: MayorCandidate;
}

export interface RegionalProvince {
  id: string;
  name: string;
  voters: number;
  mayor: MayorCandidate;
  districts: RegionalDistrict[];
}

export interface RegionalBodyData {
  governorate: Official[];
  regionalCounselors: Counselor[];
  provinces: RegionalProvince[];
}

// Types for Activity Planner Tab
export interface PlannerEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Planeado' | 'Confirmado' | 'Completado' | 'Cancelado';
  notes: string;
}

// Types for Coordinators Tab
export interface Coordinator {
  id: string;
  name: string;
  nickname: string;
  phone: string;
  address: string;
  sector: string;
  province: string;
  district: string;
}