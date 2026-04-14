import { NextRequest, NextResponse } from 'next/server';
import { listOrders, type OrderPaymentStatus } from '@/lib/orders';

const VALID_PAYMENT_STATUSES = new Set<OrderPaymentStatus>([
  'pending_payment',
  'pending',
  'paid',
  'rejected',
  'cancelled',
  'refunded',
]);

function parsePaymentStatuses(raw: string | null) {
  if (!raw || raw === 'all') {
    return [] as OrderPaymentStatus[];
  }

  return raw
    .split(',')
    .map((value) => value.trim())
    .filter((value): value is OrderPaymentStatus => VALID_PAYMENT_STATUSES.has(value as OrderPaymentStatus));
}

function isDashboardAuthorized(request: NextRequest) {
  const configuredKey = process.env.LOCAL_DASHBOARD_KEY?.trim();

  if (!configuredKey) {
    return true;
  }

  const keyFromQuery = request.nextUrl.searchParams.get('key')?.trim();
  const keyFromHeader = request.headers.get('x-local-dashboard-key')?.trim();

  return keyFromQuery === configuredKey || keyFromHeader === configuredKey;
}

function parseLimit(raw: string | null) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return 50;
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 200);
}

export async function GET(request: NextRequest) {
  if (!isDashboardAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const paymentStatuses = parsePaymentStatuses(request.nextUrl.searchParams.get('status'));
  const limit = parseLimit(request.nextUrl.searchParams.get('limit'));

  try {
    const orders = await listOrders({ limit, paymentStatuses });
    return NextResponse.json({ orders, generatedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudieron cargar los pedidos.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
