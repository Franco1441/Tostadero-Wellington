import 'server-only';

import { resolveOrderFromMercadoPagoReturn } from '@/lib/orders';

export interface PaymentReturnSearchParams {
  [key: string]: string | string[] | undefined;
}

export interface PaymentReturnContext {
  orderId: string | null;
  paymentId: string | null;
  merchantOrderId: string | null;
  rawStatus: string | null;
  order: Awaited<ReturnType<typeof resolveOrderFromMercadoPagoReturn>>;
}

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export async function readPaymentReturn(
  searchParamsPromise: Promise<PaymentReturnSearchParams>,
): Promise<PaymentReturnContext> {
  const searchParams = await searchParamsPromise;
  const orderId = firstValue(searchParams.order_id) ?? firstValue(searchParams.external_reference);
  const paymentId = firstValue(searchParams.payment_id) ?? firstValue(searchParams.collection_id);
  const merchantOrderId = firstValue(searchParams.merchant_order_id);
  const rawStatus = firstValue(searchParams.status) ?? firstValue(searchParams.collection_status);

  const order = await resolveOrderFromMercadoPagoReturn({
    orderId,
    paymentId,
    merchantOrderId,
  });

  return {
    orderId,
    paymentId,
    merchantOrderId,
    rawStatus,
    order,
  };
}
