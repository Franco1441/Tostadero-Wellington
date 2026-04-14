import { BellRing, Clock3, LoaderCircle, ReceiptText } from 'lucide-react';
import { redirect } from 'next/navigation';
import { PaymentResultButtons } from '@/components/payment-result-buttons';
import { formatPrice } from '@/lib/menu-data';
import { readPaymentReturn, type PaymentReturnSearchParams } from '@/lib/payment-return';

export const dynamic = 'force-dynamic';

interface PendientePageProps {
  searchParams: Promise<PaymentReturnSearchParams>;
}

function orderQuery(orderId?: string | null) {
  return orderId ? `?order_id=${encodeURIComponent(orderId)}` : '';
}

export default async function PendientePage({ searchParams }: PendientePageProps) {
  const paymentReturn = await readPaymentReturn(searchParams);
  const order = paymentReturn.order;

  if (order?.payment_status === 'paid') {
    redirect(`/pago/exito${orderQuery(order.id)}`);
  }

  if (
    order?.payment_status === 'rejected' ||
    order?.payment_status === 'cancelled' ||
    order?.payment_status === 'refunded'
  ) {
    redirect(`/pago/error?reason=${encodeURIComponent(order.payment_status)}${orderQuery(order.id)}`);
  }

  return (
    <main className="min-h-screen bg-primary px-4 py-6 text-primary">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-xl items-center">
        <section className="w-full rounded-[2rem] bg-white p-6 shadow-[0_28px_60px_rgba(0,0,0,0.18)] sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Clock3 className="h-10 w-10" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-primary/45">
              Pago pendiente
            </p>
            <h1 className="mt-3 text-3xl font-bold text-primary">Estamos esperando la confirmación</h1>
            <p className="mt-3 text-sm leading-relaxed text-primary/68">
              Mercado Pago todavía no terminó de validar la operación. Podés refrescar esta pantalla en unos segundos.
            </p>
          </div>

          <div className="mt-8 space-y-4 rounded-[1.6rem] bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-primary">Pedido registrado</p>
                <p className="mt-1 text-sm text-primary/68">
                  {order
                    ? `${order.customer_name} · ${order.item_count} ${order.item_count === 1 ? 'producto' : 'productos'}`
                    : 'El pedido quedó generado y espera respuesta del medio de pago.'}
                </p>
                {order ? (
                  <p className="text-sm text-primary/55">{formatPrice(order.total)}</p>
                ) : null}
                {order?.id ? (
                  <p className="mt-2 truncate text-xs uppercase tracking-[0.18em] text-primary/42">
                    Pedido {order.id}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-primary">Próximo paso</p>
                <p className="mt-1 text-sm text-primary/68">
                  Cuando Mercado Pago lo apruebe, esta misma URL va a mostrar el pedido como confirmado.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary/50">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Estado sincronizado con Mercado Pago
          </div>

          <div className="mt-8">
            <PaymentResultButtons
              primary={{ label: 'Actualizar estado', action: 'reload', primary: true }}
              secondary={{ label: 'Volver al menú', action: 'home' }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
