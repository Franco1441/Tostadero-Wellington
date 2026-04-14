import 'server-only';

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { MerchantOrder, Payment } from 'mercadopago';
import type { MenuItem } from '@/lib/menu-data';
import type { CartPricingResult } from '@/lib/pricing';
import { getMPClient, isMPConfigured } from '@/lib/mercadopago';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
  type Json,
} from '@/lib/supabase/admin';

export type OrderType = 'para_llevar' | 'consumir_local';
export type OrderPaymentStatus =
  | 'pending_payment'
  | 'pending'
  | 'paid'
  | 'rejected'
  | 'cancelled'
  | 'refunded';

export type OrderFulfillmentStatus = 'new' | 'preparing' | 'ready_for_pickup' | 'completed';

export interface OrderItemSnapshot {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  line_total: number;
}

export interface OrderRecord {
  id: string;
  customer_name: string;
  order_type: OrderType;
  items: OrderItemSnapshot[];
  item_count: number;
  subtotal: number;
  app_discount: number;
  coupon_discount: number;
  total: number;
  coupon_code: string | null;
  payment_status: OrderPaymentStatus;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  mp_merchant_order_id: string | null;
  mp_status: string | null;
  fulfillment_status: OrderFulfillmentStatus;
  customer_arriving_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PriceableOrderItem extends Pick<MenuItem, 'id' | 'name' | 'subtitle' | 'price'> {
  quantity: number;
}

interface CreatePendingOrderInput {
  customerName: string;
  orderType: OrderType;
  items: PriceableOrderItem[];
  pricing: CartPricingResult;
}

interface ListOrdersInput {
  limit?: number;
  paymentStatuses?: OrderPaymentStatus[];
}

interface MPWebhookValidationInput {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string | null;
}

interface MercadoPagoPaymentLike {
  id?: number;
  status?: string;
  status_detail?: string;
  external_reference?: string;
  order?: {
    id?: number;
  };
}

interface MercadoPagoMerchantOrderLike {
  id?: number;
  status?: string;
  order_status?: string;
  external_reference?: string;
  payments?: Array<{
    id?: number;
    status?: string;
  }>;
}

function ensureOrdersInfraReady() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      'Falta configurar Supabase para registrar pedidos. Agregá NEXT_PUBLIC_SUPABASE_URL y una clave server de Supabase (SUPABASE_SERVICE_ROLE_KEY o SUPABASE_SECRET_KEY).',
    );
  }
}

function ensureMercadoPagoReady() {
  if (!isMPConfigured()) {
    throw new Error('Mercado Pago no está configurado. Agregá MP_ACCESS_TOKEN.');
  }
}

function normalizeOrderRow(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id ?? ''),
    customer_name: String(row.customer_name ?? ''),
    order_type: String(row.order_type ?? 'para_llevar') as OrderType,
    items: Array.isArray(row.items) ? (row.items as OrderItemSnapshot[]) : [],
    item_count: Number(row.item_count ?? 0),
    subtotal: Number(row.subtotal ?? 0),
    app_discount: Number(row.app_discount ?? 0),
    coupon_discount: Number(row.coupon_discount ?? 0),
    total: Number(row.total ?? 0),
    coupon_code: row.coupon_code ? String(row.coupon_code) : null,
    payment_status: String(row.payment_status ?? 'pending_payment') as OrderPaymentStatus,
    mp_preference_id: row.mp_preference_id ? String(row.mp_preference_id) : null,
    mp_payment_id: row.mp_payment_id ? String(row.mp_payment_id) : null,
    mp_merchant_order_id: row.mp_merchant_order_id ? String(row.mp_merchant_order_id) : null,
    mp_status: row.mp_status ? String(row.mp_status) : null,
    fulfillment_status: String(row.fulfillment_status ?? 'new') as OrderFulfillmentStatus,
    customer_arriving_at: row.customer_arriving_at ? String(row.customer_arriving_at) : null,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  };
}

function toOrderItemsSnapshot(items: PriceableOrderItem[]): OrderItemSnapshot[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    subtitle: item.subtitle,
    price: item.price,
    quantity: item.quantity,
    line_total: item.price * item.quantity,
  }));
}

function toOrderItemsJson(items: PriceableOrderItem[]): Json {
  return toOrderItemsSnapshot(items) as unknown as Json;
}

function getTotalItemCount(items: PriceableOrderItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function mapMercadoPagoStatusToOrderStatus(status?: string | null): OrderPaymentStatus {
  switch (status) {
    case 'approved':
      return 'paid';
    case 'rejected':
      return 'rejected';
    case 'cancelled':
      return 'cancelled';
    case 'refunded':
    case 'charged_back':
      return 'refunded';
    case 'pending':
    case 'in_process':
    case 'in_mediation':
    case 'authorized':
      return 'pending';
    default:
      return 'pending_payment';
  }
}

function getPaymentClient() {
  ensureMercadoPagoReady();
  return new Payment(getMPClient());
}

function getMerchantOrderClient() {
  ensureMercadoPagoReady();
  return new MerchantOrder(getMPClient());
}

function getWebhookSecret() {
  return process.env.MP_WEBHOOK_SECRET ?? '';
}

function parseSignatureHeader(signatureHeader: string) {
  return signatureHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, rawValue] = part.trim().split('=');

    if (rawKey && rawValue) {
      acc[rawKey] = rawValue;
    }

    return acc;
  }, {});
}

function safeCompareHex(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function isValidMercadoPagoWebhookSignature({
  signatureHeader,
  requestId,
  dataId,
}: MPWebhookValidationInput) {
  const secret = getWebhookSecret();

  if (!secret) {
    return true;
  }

  if (!signatureHeader || !requestId || !dataId) {
    return false;
  }

  const parsedSignature = parseSignatureHeader(signatureHeader);
  const ts = parsedSignature.ts;
  const v1 = parsedSignature.v1;

  if (!ts || !v1) {
    return false;
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const generated = createHmac('sha256', secret).update(manifest).digest('hex');

  return safeCompareHex(generated, v1);
}

export async function createPendingOrder({
  customerName,
  orderType,
  items,
  pricing,
}: CreatePendingOrderInput) {
  ensureOrdersInfraReady();

  const orderId = randomUUID();
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      customer_name: customerName,
      order_type: orderType,
      items: toOrderItemsJson(items),
      item_count: getTotalItemCount(items),
      subtotal: pricing.subtotal,
      app_discount: pricing.appDiscount,
      coupon_discount: pricing.couponDiscount,
      total: pricing.total,
      coupon_code: pricing.appliedCouponCode,
      payment_status: 'pending_payment',
      fulfillment_status: 'new',
    })
    .select('*')
    .single();

  if (error || !data) {
    if (error?.message?.includes('relation "orders" does not exist')) {
      throw new Error('La tabla orders no existe todavía en Supabase. Ejecutá la migración antes de cobrar.');
    }

    throw new Error(error?.message ?? 'No se pudo registrar el pedido en Supabase.');
  }

  return normalizeOrderRow(data);
}

export async function attachPreferenceToOrder(orderId: string, preferenceId: string) {
  ensureOrdersInfraReady();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .update({
      mp_preference_id: preferenceId,
    })
    .eq('id', orderId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'No se pudo guardar la preferencia de Mercado Pago.');
  }

  return normalizeOrderRow(data);
}

export async function getOrderById(orderId: string) {
  ensureOrdersInfraReady();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeOrderRow(data) : null;
}

export async function listOrders({ limit = 50, paymentStatuses = [] }: ListOrdersInput = {}) {
  ensureOrdersInfraReady();

  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 200);

  const supabase = getSupabaseAdminClient();
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(safeLimit);

  if (paymentStatuses.length > 0) {
    query = query.in('payment_status', paymentStatuses);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => normalizeOrderRow(row));
}

async function updateOrderPaymentState(
  orderId: string,
  updates: Partial<
    Pick<
      OrderRecord,
      'mp_payment_id' | 'mp_merchant_order_id' | 'mp_status' | 'payment_status'
    >
  >,
) {
  ensureOrdersInfraReady();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'No se pudo actualizar el estado del pedido.');
  }

  return normalizeOrderRow(data);
}

async function updateOrderFulfillmentState(
  orderId: string,
  updates: Partial<Pick<OrderRecord, 'fulfillment_status' | 'customer_arriving_at'>>,
) {
  ensureOrdersInfraReady();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'No se pudo actualizar el estado operativo del pedido.');
  }

  return normalizeOrderRow(data);
}

export async function markOrderAsPreparing(orderId: string) {
  return updateOrderFulfillmentState(orderId, { fulfillment_status: 'preparing' });
}

export async function markOrderAsReadyForPickup(orderId: string) {
  return updateOrderFulfillmentState(orderId, { fulfillment_status: 'ready_for_pickup' });
}

export async function markOrderAsCompleted(orderId: string) {
  return updateOrderFulfillmentState(orderId, { fulfillment_status: 'completed' });
}

export async function markCustomerArriving(orderId: string) {
  return updateOrderFulfillmentState(orderId, {
    customer_arriving_at: new Date().toISOString(),
  });
}

export async function syncOrderFromPaymentId(paymentId: string | number) {
  ensureOrdersInfraReady();

  const payment = (await getPaymentClient().get({
    id: paymentId,
  })) as MercadoPagoPaymentLike;

  const orderId = payment.external_reference;

  if (!orderId) {
    return null;
  }

  return updateOrderPaymentState(orderId, {
    mp_payment_id: payment.id ? String(payment.id) : null,
    mp_merchant_order_id: payment.order?.id ? String(payment.order.id) : null,
    mp_status: payment.status ?? null,
    payment_status: mapMercadoPagoStatusToOrderStatus(payment.status ?? null),
  });
}

export async function syncOrderFromMerchantOrderId(merchantOrderId: string | number) {
  ensureOrdersInfraReady();

  const merchantOrder = (await getMerchantOrderClient().get({
    merchantOrderId,
  })) as MercadoPagoMerchantOrderLike;

  const orderId = merchantOrder.external_reference;

  if (!orderId) {
    return null;
  }

  const approvedPayment = merchantOrder.payments?.find((payment) => payment.status === 'approved');
  const latestPayment = approvedPayment ?? merchantOrder.payments?.[0];

  if (latestPayment?.id) {
    return syncOrderFromPaymentId(latestPayment.id);
  }

  const mpStatus = merchantOrder.order_status ?? merchantOrder.status ?? null;

  return updateOrderPaymentState(orderId, {
    mp_merchant_order_id: merchantOrder.id ? String(merchantOrder.id) : null,
    mp_status: mpStatus,
    payment_status: mapMercadoPagoStatusToOrderStatus(mpStatus),
  });
}

export async function resolveOrderFromMercadoPagoReturn(params: {
  orderId?: string | null;
  paymentId?: string | number | null;
  merchantOrderId?: string | number | null;
}) {
  const { orderId, paymentId, merchantOrderId } = params;

  if (paymentId) {
    const order = await syncOrderFromPaymentId(paymentId);
    if (order) {
      return order;
    }
  }

  if (merchantOrderId) {
    const order = await syncOrderFromMerchantOrderId(merchantOrderId);
    if (order) {
      return order;
    }
  }

  if (orderId) {
    return getOrderById(orderId);
  }

  return null;
}
