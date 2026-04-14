import { CheckCircle2, Clock3, MapPin, ReceiptText } from 'lucide-react';
import { redirect } from 'next/navigation';
import { CustomerArrivalCard } from '@/components/customer-arrival-card';
import { PaymentResultButtons } from '@/components/payment-result-buttons';
import { formatPrice } from '@/lib/menu-data';
import { readPaymentReturn, type PaymentReturnSearchParams } from '@/lib/payment-return';
import { STORE_INFO, getCompactHours } from '@/lib/store-info';

export const dynamic = 'force-dynamic';

interface ExitoPageProps {
  searchParams: Promise<PaymentReturnSearchParams>;
}

function orderQuery(orderId?: string | null) {
  return orderId ? `?order_id=${encodeURIComponent(orderId)}` : '';
}

export default async function ExitoPage({ searchParams }: ExitoPageProps) {
  const paymentReturn = await readPaymentReturn(searchParams);
  const hasLookupData =
    Boolean(paymentReturn.orderId) ||
    Boolean(paymentReturn.paymentId) ||
    Boolean(paymentReturn.merchantOrderId);

  if (!hasLookupData) {
    redirect('/pago/error?reason=no_payment_info');
  }

  const order = paymentReturn.order;

  if (!order) {
    redirect('/pago/error?reason=order_not_found');
  }

  if (order.payment_status === 'pending' || order.payment_status === 'pending_payment') {
    redirect(`/pago/pendiente${orderQuery(order.id)}`);
  }

  if (order.payment_status !== 'paid') {
    redirect(`/pago/error?reason=${encodeURIComponent(order.payment_status)}${orderQuery(order.id)}`);
  }

  return (
    <main className="min-h-screen bg-primary px-4 py-6 text-primary">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-xl items-center">
        <section className="w-full rounded-[2rem] bg-white p-6 shadow-[0_28px_60px_rgba(0,0,0,0.18)] sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-primary/45">
              Pago aprobado
            </p>
            <h1 className="mt-3 text-3xl font-bold text-primary">Pedido confirmado</h1>
            <p className="mt-3 text-sm leading-relaxed text-primary/68">
              El pago ya quedó validado y el pedido se registró correctamente para retirar en{' '}
              {STORE_INFO.name}.
            </p>
          </div>

          <div className="mt-8 space-y-4 rounded-[1.6rem] bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-primary">Retiro estimado</p>
                <p className="mt-1 text-sm text-primary/68">Preparación habitual: 15 a 20 minutos.</p>
                <p className="mt-1 text-sm text-primary/55">{getCompactHours()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-primary">{STORE_INFO.name}</p>
                <p className="mt-1 text-sm text-primary/68">{STORE_INFO.address.street}</p>
                <p className="text-sm text-primary/55">
                  {STORE_INFO.address.city}, {STORE_INFO.address.country}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-primary">Detalle del pedido</p>
                <p className="mt-1 text-sm text-primary/68">{order.customer_name}</p>
                <p className="text-sm text-primary/55">
                  {order.item_count} {order.item_count === 1 ? 'producto' : 'productos'} ·{' '}
                  {formatPrice(order.total)}
                </p>
                <p className="mt-2 truncate text-xs uppercase tracking-[0.18em] text-primary/42">
                  Pedido {order.id}
                </p>
                {order.mp_payment_id ? (
                  <p className="truncate text-xs uppercase tracking-[0.18em] text-primary/42">
                    Pago {order.mp_payment_id}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <CustomerArrivalCard
            orderId={order.id}
            initialArrivalAt={order.customer_arriving_at}
            fulfillmentStatus={order.fulfillment_status}
          />

          <div className="mt-8">
            <PaymentResultButtons
              clearCartOnMount
              primary={{ label: 'Volver al menú', action: 'home', primary: true }}
              secondary={{ label: 'Guardar comprobante', action: 'print' }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
