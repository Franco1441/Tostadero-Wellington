import type { Category, MenuItem } from '@/lib/menu-data';
import {
  promotions,
  type Promotion,
  type PromotionDay,
  type PromotionRequirement,
} from '@/lib/promotions-data';
import { PROMOTIONS_ENABLED } from '@/lib/feature-flags';
import { STORE_TIME_ZONE } from '@/lib/store-info';

export interface PriceableItem extends Pick<MenuItem, 'id' | 'name' | 'subtitle' | 'price' | 'category'> {
  quantity: number;
}

export interface CartPricingResult {
  subtotal: number;
  discount: number;
  appDiscount: number;
  couponDiscount: number;
  total: number;
  appliedPromotion: Promotion | null;
  appliedCouponCode: string | null;
}

export interface CouponResult {
  success: boolean;
  message: string;
  promotion: Promotion | null;
}

export const APP_DISCOUNT_PERCENT = 10;

const WEEKDAY_MAP: Record<string, PromotionDay> = {
  Sun: 'SU',
  Mon: 'MO',
  Tue: 'TU',
  Wed: 'WE',
  Thu: 'TH',
  Fri: 'FR',
  Sat: 'SA',
};

function getLocalDayAndHour(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');

  return {
    day: WEEKDAY_MAP[weekday] ?? 'MO',
    hour,
  };
}

function isPromotionScheduledNow(promotion: Promotion, now: Date) {
  const { day, hour } = getLocalDayAndHour(now);

  if (promotion.activeDays && !promotion.activeDays.includes(day)) {
    return false;
  }

  if (typeof promotion.startHour === 'number' && hour < promotion.startHour) {
    return false;
  }

  if (typeof promotion.endHour === 'number' && hour >= promotion.endHour) {
    return false;
  }

  return true;
}

function matchesRequirement(item: PriceableItem, requirement: PromotionRequirement) {
  const matchesCategory =
    !requirement.categories || requirement.categories.includes(item.category as Category);
  const matchesItem =
    !requirement.itemIds || requirement.itemIds.includes(item.id);

  return matchesCategory && matchesItem;
}

function expandEligibleUnitPrices(items: PriceableItem[], promotion: Promotion) {
  const unitPrices: number[] = [];

  items.forEach((item) => {
    const isEligibleCategory =
      !promotion.appliesToCategories ||
      promotion.appliesToCategories.includes(item.category as Category);
    const isEligibleItem =
      !promotion.appliesToItemIds || promotion.appliesToItemIds.includes(item.id);

    if (!isEligibleCategory || !isEligibleItem) {
      return;
    }

    for (let index = 0; index < item.quantity; index += 1) {
      unitPrices.push(item.price);
    }
  });

  return unitPrices;
}

function getEligibleSubtotal(items: PriceableItem[], promotion: Promotion) {
  return items.reduce((sum, item) => {
    const isEligibleCategory =
      !promotion.appliesToCategories ||
      promotion.appliesToCategories.includes(item.category as Category);
    const isEligibleItem =
      !promotion.appliesToItemIds || promotion.appliesToItemIds.includes(item.id);

    if (!isEligibleCategory || !isEligibleItem) {
      return sum;
    }

    return sum + item.price * item.quantity;
  }, 0);
}

function calculateBundleDiscount(items: PriceableItem[], promotion: Promotion) {
  if (!promotion.requirements?.length || typeof promotion.bundlePrice !== 'number') {
    return 0;
  }

  const availableUnits = items.flatMap((item) =>
    Array.from({ length: item.quantity }, () => ({
      id: item.id,
      category: item.category,
      price: item.price,
    })),
  );

  const groupedUnits = promotion.requirements.map((requirement) =>
    availableUnits
      .filter((unit) => matchesRequirement(unit as PriceableItem, requirement))
      .sort((left, right) => right.price - left.price),
  );

  const bundleCount = groupedUnits.reduce((smallest, group, index) => {
    const requirementQuantity = promotion.requirements?.[index]?.quantity ?? 1;
    return Math.min(smallest, Math.floor(group.length / requirementQuantity));
  }, Number.POSITIVE_INFINITY);

  if (!Number.isFinite(bundleCount) || bundleCount <= 0) {
    return 0;
  }

  let discount = 0;

  for (let bundleIndex = 0; bundleIndex < bundleCount; bundleIndex += 1) {
    let bundleTotal = 0;

    groupedUnits.forEach((group, index) => {
      const requirementQuantity = promotion.requirements?.[index]?.quantity ?? 1;
      const selected = group.splice(0, requirementQuantity);
      bundleTotal += selected.reduce((sum, unit) => sum + unit.price, 0);
    });

    discount += Math.max(0, bundleTotal - promotion.bundlePrice);
  }

  return discount;
}

function getPromotionDiscount(items: PriceableItem[], promotion: Promotion) {
  if (promotion.type === 'percent' && promotion.value) {
    const eligibleSubtotal = getEligibleSubtotal(items, promotion);
    return Math.round(eligibleSubtotal * (promotion.value / 100));
  }

  if (promotion.type === 'amount' && promotion.value) {
    const eligibleSubtotal = getEligibleSubtotal(items, promotion);
    return Math.min(eligibleSubtotal, promotion.value);
  }

  if (promotion.type === 'buy_x_get_y' && promotion.x && promotion.y) {
    const unitPrices = expandEligibleUnitPrices(items, promotion).sort((left, right) => left - right);
    const groupSize = promotion.x + promotion.y;

    if (groupSize <= 0) {
      return 0;
    }

    const freeCount = Math.floor(unitPrices.length / groupSize) * promotion.y;
    return unitPrices.slice(0, freeCount).reduce((sum, price) => sum + price, 0);
  }

  if (promotion.type === 'bundle') {
    return calculateBundleDiscount(items, promotion);
  }

  return 0;
}

export function validateCoupon(
  code: string,
  items: PriceableItem[],
  now = new Date(),
): CouponResult {
  if (!PROMOTIONS_ENABLED) {
    return {
      success: false,
      message: 'Las promociones están pausadas por el momento.',
      promotion: null,
    };
  }

  const normalizedCode = code.trim().toLowerCase();

  const promotion =
    promotions.find(
      (candidate) =>
        !candidate.automatic &&
        candidate.code?.toLowerCase() === normalizedCode,
    ) ?? null;

  if (!promotion) {
    return { success: false, message: 'Código inválido.', promotion: null };
  }

  if (!isPromotionScheduledNow(promotion, now)) {
    return {
      success: false,
      message: 'Ese cupón no está disponible en este horario.',
      promotion: null,
    };
  }

  const discount = getPromotionDiscount(items, promotion);

  if (discount <= 0) {
    return {
      success: false,
      message: 'Ese cupón no aplica a tu carrito actual.',
      promotion: null,
    };
  }

  return {
    success: true,
    message: `Cupón ${promotion.code} aplicado.`,
    promotion,
  };
}

export function calculateCartPricing(
  items: PriceableItem[],
  couponCode?: string | null,
  now = new Date(),
): CartPricingResult {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!PROMOTIONS_ENABLED) {
    return {
      subtotal,
      discount: 0,
      appDiscount: 0,
      couponDiscount: 0,
      total: subtotal,
      appliedPromotion: null,
      appliedCouponCode: null,
    };
  }

  const appDiscount = Math.round(subtotal * (APP_DISCOUNT_PERCENT / 100));

  const couponResult =
    couponCode && items.length > 0 ? validateCoupon(couponCode, items, now) : null;
  const appliedPromotion = couponResult?.success ? couponResult.promotion : null;
  const couponDiscount = appliedPromotion ? getPromotionDiscount(items, appliedPromotion) : 0;

  const discount = Math.round(appDiscount + couponDiscount);
  const total = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    appDiscount,
    couponDiscount,
    total,
    appliedPromotion,
    appliedCouponCode: appliedPromotion?.code ?? null,
  };
}
