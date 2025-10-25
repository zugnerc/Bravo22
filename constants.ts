import type { SituationalStatusData, RegionalBodyData, PlannerEvent, Coordinator, Counselor } from './types';

export const initialSituationalStatusData: SituationalStatusData = {
  ancashVoters: 1200000,
  parties: [
    { id: 'p1', name: 'Partido Innovador', symbolUrl: 'https://picsum.photos/id/1/50/50', type: 'Nuevo' },
    { id: 'p2', name: 'Alianza Tradicional', symbolUrl: 'https://picsum.photos/id/2/50/50', type: 'Tradicional' },
    { id: 'p3', name: 'Fuerza Regional', symbolUrl: 'https://picsum.photos/id/3/50/50', type: 'Nuevo' },
  ],
  candidates: [
    { id: 'c1', photoUrl: 'https://picsum.photos/id/101/100/100', name: 'Juan Pérez Rojas', dni: '12345678', nickname: 'El Constructor', partyId: 'p1', isAffiliated: true, facebookUrl: '#', tiktokUrl: '#', position: 'gobernador', ranking: 1 },
    { id: 'c2', photoUrl: 'https://picsum.photos/id/102/100/100', name: 'Maria Garcia Lopez', dni: '87654321', nickname: 'La Luchadora', partyId: 'p2', isAffiliated: false, facebookUrl: '#', tiktokUrl: '#', position: 'gobernador', ranking: 2 },
    { id: 'c3', photoUrl: 'https://picsum.photos/id/103/100/100', name: 'Carlos Mendoza Solis', dni: '11223344', nickname: 'El Profe', partyId: 'p3', isAffiliated: true, facebookUrl: '#', tiktokUrl: '#', position: 'gobernador', ranking: 3 },
    { id: 'c4', photoUrl: 'https://picsum.photos/id/104/100/100', name: 'Ana Torres Vega', dni: '44332211', nickname: 'La Jefa', partyId: 'p1', isAffiliated: true, facebookUrl: '#', tiktokUrl: '#', position: 'alcalde_provincial', provinceId: 'prov1', ranking: 1 },
    { id: 'c5', photoUrl: 'https://picsum.photos/id/105/100/100', name: 'Luis Ramos Quispe', dni: '55667788', nickname: 'Lucho', partyId: 'p2', isAffiliated: false, facebookUrl: '#', tiktokUrl: '#', position: 'alcalde_provincial', provinceId: 'prov2', ranking: 1 },
    { id: 'c6', photoUrl: 'https://picsum.photos/id/106/100/100', name: 'Sofia Castro Diaz', dni: '99887766', nickname: 'La Doctora', partyId: 'p1', isAffiliated: true, facebookUrl: '#', tiktokUrl: '#', position: 'alcalde_distrital', provinceId: 'prov1', districtId: 'dist1', ranking: 1 },
  ],
  provinces: [
    { id: 'prov1', name: 'Santa', voters: 450000, districts: [
      {id: 'dist1', name: 'Chimbote', voters: 220000},
      {id: 'dist2', name: 'Nuevo Chimbote', voters: 150000},
    ] },
    { id: 'prov2', name: 'Huaraz', voters: 180000, districts: [
       {id: 'dist3', name: 'Huaraz', voters: 130000},
    ] },
    { id: 'prov3', name: 'Huari', voters: 65000, districts: [] },
  ],
  otherActivities: [
    { id: 'o1', partyId: 'p2', description: 'Mitin de Alianza Tradicional en Huaraz', link: '#' },
    { id: 'o2', partyId: 'p3', description: 'Caravana de Fuerza Regional en Chimbote', link: '#' },
  ]
};

// FIX: Corrected Counselor type definition
const defaultCouncilors: Counselor[] = [
    { id: 'cn1', name: 'Regidor 1 Apellido', dni: '12312312', facebookUrl: '#', tiktokUrl: '#', quotaGender: 'Masculino', quotaCommunity: false, isAffiliated: true, role: 'Titular', phone: '987654321' },
    { id: 'cn2', name: 'Regidora 2 Apellido', dni: '32132132', facebookUrl: '#', tiktokUrl: '#', quotaGender: 'Femenino', quotaCommunity: true, isAffiliated: false, role: 'Titular', phone: '987654322' },
];

export const initialRegionalBodyData: RegionalBodyData = {
    governorate: [
        { id: 'g1', name: 'Candidato a Gobernador', position: 'Gobernador', dni: '10101010' },
        { id: 'g2', name: 'Candidata a Vicegobernadora', position: 'Vicegobernadora', dni: '20202020' },
    ],
    regionalCounselors: defaultCouncilors.slice(0,1),
    provinces: [
        { id: 'rp1', name: 'Santa', voters: 450000, mayor: { id: 'rm1', name: 'Alcalde Provincial Santa', nickname: 'Chino', dni: '30303030', facebookUrl: '#', tiktokUrl: '#', isAffiliated: true, gender: 'Masculino', phone: '999888777', councilors: defaultCouncilors }, districts: [
            { id: 'rd1', name: 'Chimbote', voters: 220000, mayor: { id: 'rdm1', name: 'Alcalde Distrital Chimbote', nickname: 'Beto', dni: '40404040', facebookUrl: '#', tiktokUrl: '#', isAffiliated: false, gender: 'Masculino', phone: '999888666', councilors: defaultCouncilors } }
        ]}
    ]
};

export const initialPlannerData: PlannerEvent[] = [
  { id: 'pe1', title: 'Reunión de planificación estratégica', date: '2024-08-15T18:00', location: '#', status: 'Confirmado', notes: 'Definir próximos pasos de campaña.'},
  { id: 'pe2', title: 'Lanzamiento de campaña', date: '2026-01-15T10:00', location: 'Plaza de Armas, Huaraz', status: 'Planeado', notes: 'Coordinar con prensa y logística.'},
  { id: 'pe3', title: 'Visita al mercado de Chimbote', date: '2026-02-01T09:00', location: 'Mercado Central, Chimbote', status: 'Confirmado', notes: 'Preparar volantes y equipo de sonido.'}
];

export const initialCoordinatorsData: Coordinator[] = [
    { id: 'co1', name: 'Coordinador General Santa', nickname: 'Chemo', phone: '51987654321', address: 'Av. Pardo 123', sector: 'Casco Urbano', province: 'Santa', district: 'Chimbote'},
    { id: 'co2', name: 'Coordinador Huaraz', nickname: 'Lucho', phone: '51912345678', address: 'Jr. 28 de Julio 456', sector: 'Centro', province: 'Huaraz', district: 'Huaraz'},
];