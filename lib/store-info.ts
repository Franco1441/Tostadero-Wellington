export const STORE_TIME_ZONE = 'America/Argentina/Cordoba';

export const STORE_INFO = {
  name: 'Tostadero Wellington',
  shortName: 'Tostadero',
  displayName: 'WELLINGTON',
  tagline: 'Café de especialidad',
  heroKicker: 'coffee oasis',
  description:
    'Café de especialidad tostado artesanalmente. Preparamos cada taza con pasión y una carta pensada para acompañar desayunos, meriendas y antojos de todos los días.',
  address: {
    street: 'Sara Pinasco de Julierac 1749',
    city: 'Santa Fe',
    country: 'Argentina',
  },
  contact: {
    phone: '+54 342 123 4567',
    email: 'hola@tostaderowellington.com',
    instagram: 'https://instagram.com/tostaderowellington',
  },
  hours: [
    { label: 'Todos los días', shortLabel: 'Todos los días', hours: '6:00 - 20:00' },
  ],
  highlights: ['Café de especialidad', 'Pastelería', 'Desayunos'],
  serviceModes: ['Para llevar', 'Consumir en el local'],
} as const;

export function getAddressLines() {
  return [STORE_INFO.address.street, `${STORE_INFO.address.city}, ${STORE_INFO.address.country}`];
}

export function getCompactHours() {
  return STORE_INFO.hours
    .map((item) => `${item.shortLabel}: ${item.hours}`)
    .join(' · ');
}
