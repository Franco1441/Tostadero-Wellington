export type Category =
  | 'cafe'
  | 'con-leche'
  | 'frios'
  | 'sin-cafe'
  | 'bakery'
  | 'bebidas'
  | 'healthy';

export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  category: Category;
  imagePath?: string;
  description?: string;
  badge?: string;
}

export const menuItems: MenuItem[] = [

  // ── CAFÉ ──────────────────────────────────────────────────────────────────
  {
    id: 'espresso',
    name: 'Espresso',
    subtitle: 'Espresso',
    price: 3500,
    category: 'cafe',
    imagePath: '/products/espresso.png',
    description: 'Cafecito corto, fuerte, un shot doble.',
    badge: 'TAZA S',
  },
  {
    id: 'lungo',
    name: 'Lungo',
    subtitle: 'Lungo',
    price: 3500,
    category: 'cafe',
    imagePath: '/products/lungo.png',
    description: 'Tacita de Espresso, llena hasta arriba de café.',
    badge: 'TAZA S',
  },
  {
    id: 'americano',
    name: 'Americano',
    subtitle: 'Americano',
    price: 3500,
    category: 'cafe',
    imagePath: '/products/americano.png',
    description: 'Espresso servido con agua caliente.',
    badge: 'TAZA L',
  },

  // ── CAFÉ CON LECHE ────────────────────────────────────────────────────────
  {
    id: 'macchiato',
    name: 'Macchiato',
    subtitle: 'Macchiato',
    price: 4000,
    category: 'con-leche',
    imagePath: '/products/espresso.png',
    description: 'Espresso con espuma de leche (sabor fuerte).',
    badge: 'TAZA S',
  },
  {
    id: 'cortado',
    name: 'Cortado',
    subtitle: 'Cortado',
    price: 6000,
    category: 'con-leche',
    imagePath: '/products/espresso.png',
    description: 'Espresso con un poco de leche.',
    badge: 'TAZA M',
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    subtitle: 'Flat White',
    price: 6000,
    category: 'con-leche',
    imagePath: '/products/flat-white.png',
    description: 'Espresso con leche texturizada (el famoso café con leche).',
    badge: 'TAZA L',
  },
  {
    id: 'latte',
    name: 'Latte',
    subtitle: 'Latte',
    price: 6000,
    category: 'con-leche',
    imagePath: '/products/latte.png',
    description: 'Espresso con mucha leche.',
    badge: 'TAZA XL',
  },
  {
    id: 'cappuccino',
    name: 'Capuccino',
    subtitle: 'Capuccino',
    price: 6000,
    category: 'con-leche',
    imagePath: '/products/latte.png',
    description: 'Latte con cacao y canela.',
    badge: 'TAZA XL',
  },

  // ── CAFÉ FRÍO ─────────────────────────────────────────────────────────────
  {
    id: 'latte-frio',
    name: 'Latte',
    subtitle: 'Machiatto Frío',
    price: 7500,
    category: 'frios',
    imagePath: '/products/iced-latte.png',
    description: 'Shot de espresso doble, hielo, shot de sirope de maple y leche espumada.',
  },
  {
    id: 'naranja-latte',
    name: 'Latte',
    subtitle: 'Naranja',
    price: 7500,
    category: 'frios',
    imagePath: '/products/blanco-naranja.png',
    description: 'Doble shot de naranja y chocolate blanco, hielo, doble shot de espresso y leche espumada.',
  },
  {
    id: 'pistacho-latte',
    name: 'Latte',
    subtitle: 'Pistacho',
    price: 7500,
    category: 'frios',
    imagePath: '/products/pistacho.png',
    description: 'Doble shot de pistacho y chocolate blanco, hielo, doble shot de espresso y leche espumada.',
  },
  {
    id: 'aerocano',
    name: 'Aerocano',
    subtitle: 'Nitrogenado',
    price: 5000,
    category: 'frios',
    imagePath: '/products/cold-brew.png',
    description: 'Americano nitrogenado frío.',
  },
  {
    id: 'espresso-tonic',
    name: 'Espresso',
    subtitle: 'Tonic',
    price: 6000,
    category: 'frios',
    imagePath: '/products/tonic.png',
    description: 'Hielo, espresso doble y tónica Schweppes.',
  },

  // ── SIN CAFÉ ──────────────────────────────────────────────────────────────
  {
    id: 'submarino',
    name: 'Submarino',
    subtitle: 'Submarino',
    price: 5000,
    category: 'sin-cafe',
    imagePath: '/products/mocha.png',
    description: 'Barrita de chocolate Águila, leche espumada caliente y decoración de cacao.',
  },
  {
    id: 'chocolatada',
    name: 'Chocolatada',
    subtitle: 'Chocolatada',
    price: 4000,
    category: 'sin-cafe',
    description: 'Cacao y leche espumada, puede ser fría.',
  },
  {
    id: 'te-caliente',
    name: 'Té en Hebras',
    subtitle: 'Caliente',
    price: 4500,
    category: 'sin-cafe',
    description: 'Té alemán, frío o caliente.',
  },
  {
    id: 'te-frio',
    name: 'Té en Hebras',
    subtitle: 'Frío',
    price: 5000,
    category: 'sin-cafe',
    description: 'Té alemán, frío o caliente.',
  },

  // ── BAKERY ────────────────────────────────────────────────────────────────
  {
    id: 'medialuna-pucue',
    name: 'Medialuna',
    subtitle: 'Laminada',
    price: 4000,
    category: 'bakery',
    description: 'Creación de amor y obsesión plena al arte de los laminados.',
    badge: 'Pucue',
  },
  {
    id: 'windy-deluxe',
    name: 'Windy',
    subtitle: 'Deluxe',
    price: 5000,
    category: 'bakery',
    description: 'Medialuna rellena con dulce de leche, nevada con azúcar impalpable.',
  },
  {
    id: 'welly-supreme',
    name: 'Welly',
    subtitle: 'Supreme',
    price: 7000,
    category: 'bakery',
    description: 'Medialunas laminadas con jamón y queso, humectadas con manteca, pedila calentita.',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    subtitle: 'Artesanales',
    price: 5000,
    category: 'bakery',
    description: 'Podés pedirlas calentitas, y ahora también reservarlas.',
  },
  {
    id: 'budin-banana',
    name: 'Budín',
    subtitle: 'Banana y Choco',
    price: 4000,
    category: 'bakery',
    description: 'Porción de budín de banana, azúcar mascabo, harina integral, chips de chocolate y tiras de chocolate negro.',
  },
  {
    id: 'danesas',
    name: 'Danesas',
    subtitle: 'Danesas',
    price: 4000,
    category: 'bakery',
    description: 'Pieza danesa de pera o de manzana.',
  },
  {
    id: 'monitos',
    name: 'Monitos',
    subtitle: 'Monitos',
    price: 8000,
    category: 'bakery',
    description: 'La especialidad de la casa, rellenas de dulce de leche y pastelera.',
    badge: 'Especial',
  },
  {
    id: 'roll-canela',
    name: 'Roll de',
    subtitle: 'Canela',
    price: 7500,
    category: 'bakery',
    description: 'Estilo nórdico, con frosting de queso crema y naranja.',
  },

  // ── BEBIDAS ───────────────────────────────────────────────────────────────
  {
    id: 'vaso-naranja',
    name: 'Naranja',
    subtitle: 'Exprimida',
    price: 2000,
    category: 'bebidas',
    description: 'Citric (por el momento). Jarra $6.000.',
  },
  {
    id: 'agua',
    name: 'Agua',
    subtitle: 'Mineral',
    price: 2500,
    category: 'bebidas',
    description: 'Botella de agua mineral.',
  },
  {
    id: 'agua-gas',
    name: 'Agua',
    subtitle: 'con Gas',
    price: 2500,
    category: 'bebidas',
    description: 'Agua con gas.',
  },

  // ── HEALTHY ───────────────────────────────────────────────────────────────
  {
    id: 'cookies-saludables',
    name: 'Cookies',
    subtitle: 'Saludables',
    price: 3500,
    category: 'healthy',
    description: 'Hechas con harina de almendra, azúcar mascabo, nueces y pasas de uva.',
  },
  {
    id: 'yogurt-granola',
    name: 'Yogurt',
    subtitle: '+ Granola',
    price: 8500,
    category: 'healthy',
    description: 'Presentado en un vasito de vidrio, intercalado de yogurt y granola, con arándanos deshidratados.',
    badge: 'Favorito',
  },
  {
    id: 'mini-granolado',
    name: 'Mini',
    subtitle: 'Granolado',
    price: 3500,
    category: 'healthy',
    description: 'Yogurt con granola mini.',
  },
];

export const categories = [
  { id: 'cafe',      label: 'Café',       fullLabel: 'Café' },
  { id: 'con-leche', label: 'Con Leche',  fullLabel: 'Café con Leche' },
  { id: 'frios',     label: 'Frío',       fullLabel: 'Café Frío' },
  { id: 'sin-cafe',  label: 'Sin Café',   fullLabel: 'Sin Café' },
  { id: 'bakery',    label: 'Bakery',     fullLabel: 'Bakery' },
  { id: 'bebidas',   label: 'Bebidas',    fullLabel: 'Bebidas' },
  { id: 'healthy',   label: 'Healthy',    fullLabel: 'Healthy' },
] as const;

// Productos destacados en el home
export const homeFeaturedItemIds = [
  'pistacho-latte',
  'flat-white',
  'monitos',
  'roll-canela',
  'yogurt-granola',
] as const;

export function formatPrice(price: number | undefined): string {
  if (price === undefined || price === null || isNaN(price)) return '$0';
  return `$${price.toLocaleString('es-AR')}`;
}
