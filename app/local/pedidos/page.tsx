import type { Metadata } from 'next';
import { LocalOrdersBoard } from '@/components/local-orders-board';
import { listOrders, type OrderPaymentStatus } from '@/lib/orders';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: 'Panel Local · Pedidos',
  description: 'Vista interna de pedidos para el local.',
  icons: {
    icon: [
      { url: '/panel-tostadero-logo.jpg', sizes: '755x755', type: 'image/jpeg' },
      { url: '/logo-tostadero.jpg', sizes: '755x755', type: 'image/jpeg' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-tostadero-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/panel-tostadero-logo.jpg',
    apple: '/apple-icon.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

const VALID_PAYMENT_STATUSES = new Set<OrderPaymentStatus>([
  'pending_payment',
  'pending',
  'paid',
  'rejected',
  'cancelled',
  'refunded',
]);

function takeFirst(value: string | string[] | undefined) {
  if (!value) {
    return '';
  }

  return Array.isArray(value) ? value[0] ?? '' : value;
}

function parseStatuses(rawStatus: string) {
  if (!rawStatus || rawStatus === 'all') {
    return [] as OrderPaymentStatus[];
  }

  return rawStatus
    .split(',')
    .map((value) => value.trim())
    .filter((value): value is OrderPaymentStatus => VALID_PAYMENT_STATUSES.has(value as OrderPaymentStatus));
}

function getOrdersPanelErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.toLowerCase().includes('fetch failed')) {
    return 'No se pudo conectar con la base de pedidos. El panel está activo, pero todavía no puede sincronizar pedidos.';
  }

  return message || 'No se pudieron cargar los pedidos.';
}

export default async function LocalOrdersPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const filter = takeFirst(searchParams.status) || 'all';
  const key = takeFirst(searchParams.key) || null;

  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let initialErrorMessage: string | null = null;

  try {
    orders = await listOrders({
      limit: 100,
      paymentStatuses: parseStatuses(filter),
    });
  } catch (error) {
    initialErrorMessage = getOrdersPanelErrorMessage(error);
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-primary/10 via-background to-background">
      <LocalOrdersBoard
        initialOrders={orders}
        initialFilter={filter}
        initialErrorMessage={initialErrorMessage}
        accessKey={key}
      />
    </div>
  );
}
