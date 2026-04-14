import type { Category } from '@/lib/menu-data';

export type PromoType = 'percent' | 'amount' | 'buy_x_get_y' | 'bundle';
export type PromotionDay = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export interface PromotionRequirement {
  categories?: Category[];
  itemIds?: string[];
  quantity?: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  code?: string;
  color: string;
  badge?: string;
  automatic?: boolean;
  type: PromoType;
  value?: number;
  x?: number;
  y?: number;
  bundlePrice?: number;
  appliesToCategories?: Category[];
  appliesToItemIds?: string[];
  requirements?: PromotionRequirement[];
  activeDays?: PromotionDay[];
  startHour?: number;
  endHour?: number;
}

export const promotions: Promotion[] = [
  {
    id: 'promo-app',
    title: 'Descuento App',
    description: 'Ya viene aplicado en cada pedido online',
    discountLabel: '10% OFF',
    color: 'from-amber-400 to-orange-600',
    badge: 'Automático',
    automatic: true,
    type: 'percent',
    value: 10,
  },
  {
    id: 'promo-frios-2x3',
    title: 'Compra 2, llevá 3',
    description: 'En cafés frío',
    discountLabel: '1 GRATIS',
    code: 'FRIOS23',
    color: 'from-blue-400 to-blue-600',
    badge: 'Vigente',
    type: 'buy_x_get_y',
    x: 2,
    y: 1,
    appliesToCategories: ['frios'],
  },
  {
    id: 'promo-happy-hour',
    title: 'Happy Hour',
    description: 'Lun-Vie 14:00 a 17:00',
    discountLabel: '15% OFF',
    code: 'HAPPY15',
    color: 'from-pink-400 to-rose-600',
    badge: 'Por tiempo',
    type: 'percent',
    value: 15,
    activeDays: ['MO', 'TU', 'WE', 'TH', 'FR'],
    startHour: 14,
    endHour: 17,
  },
  {
    id: 'promo-manana',
    title: 'Descuento Mañana',
    description: '10% OFF en cafés de 7:00 a 12:00',
    discountLabel: '10% OFF',
    code: 'CAL10',
    color: 'from-yellow-400 to-amber-600',
    badge: 'Mañana',
    type: 'percent',
    value: 10,
    appliesToCategories: ['cafe', 'con-leche'],
    startHour: 7,
    endHour: 12,
  },
  {
    id: 'promo-combo',
    title: 'Combo Wellington',
    description: 'Café con leche + Medialuna',
    discountLabel: '$8.500',
    code: 'COMBO',
    color: 'from-emerald-400 to-green-600',
    badge: 'Combo',
    type: 'bundle',
    bundlePrice: 8500,
    requirements: [
      {
        categories: ['con-leche'],
        quantity: 1,
      },
      {
        itemIds: ['medialuna-pucue', 'windy-deluxe', 'welly-supreme'],
        quantity: 1,
      },
    ],
  },
];
