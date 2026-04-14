import { NextRequest, NextResponse } from 'next/server';
import {
  isValidMercadoPagoWebhookSignature,
  syncOrderFromMerchantOrderId,
  syncOrderFromPaymentId,
} from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface MPWebhookPayload {
  action?: string;
  type?: string;
  topic?: string;
  data?: {
    id?: string | number;
  };
}

function getQueryValue(url: URL, key: string) {
  return url.searchParams.get(key);
}

function getNotificationType(payload: MPWebhookPayload, url: URL) {
  const directType =
    payload.type ??
    payload.topic ??
    getQueryValue(url, 'type') ??
    getQueryValue(url, 'topic');

  if (directType) {
    return directType;
  }

  if (payload.action?.startsWith('payment.')) {
    return 'payment';
  }

  if (payload.action?.startsWith('merchant_order.')) {
    return 'merchant_order';
  }

  return null;
}

function getDataId(payload: MPWebhookPayload, url: URL) {
  const dataId =
    payload.data?.id ??
    getQueryValue(url, 'data.id') ??
    getQueryValue(url, 'data[id]') ??
    getQueryValue(url, 'id');

  return dataId ? String(dataId) : null;
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  let payload: MPWebhookPayload = {};

  try {
    payload = (await request.json()) as MPWebhookPayload;
  } catch {
    payload = {};
  }

  const dataId = getDataId(payload, url);
  const requestId = request.headers.get('x-request-id') ?? request.headers.get('request-id');
  const signatureHeader = request.headers.get('x-signature');

  if (
    !isValidMercadoPagoWebhookSignature({
      signatureHeader,
      requestId,
      dataId,
    })
  ) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  const notificationType = getNotificationType(payload, url);

  if (!notificationType || !dataId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    if (notificationType.includes('payment')) {
      await syncOrderFromPaymentId(dataId);
    } else if (notificationType.includes('merchant_order')) {
      await syncOrderFromMerchantOrderId(dataId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      '[MP webhook] Error al sincronizar pedido:',
      error instanceof Error ? error.message : error,
    );

    return NextResponse.json({ ok: false, error: 'sync_failed' }, { status: 500 });
  }
}
