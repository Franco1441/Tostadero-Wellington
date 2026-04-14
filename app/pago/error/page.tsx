import { AlertCircle, CircleHelp, CreditCard, RotateCcw } from 'lucide-react';
import { redirect } from 'next/navigation';
import { PaymentResultButtons } from '@/components/payment-result-buttons';
import { readPaymentReturn, type PaymentReturnSearchParams } from '@/lib/payment-return';
import { STORE_INFO } from '@/lib/store-info';

export const dynamic = 'force-dynamic';

const ERROR_MESSAGES: Record<string, string> = {
  no_payment_info: 'El pago no se completó o fue cancelado antes de terminar.',
  order_not_found: 'No encontramos el pedido asociado a este pago.',
  rejected: 'El medio de pago rechazó la operación.',
  cancelled: 'El pago fue cancelado antes de aprobarse.',
  refunded: 'El pago aparece como reembolsado.',
  default: 'Hubo un problema al validar el pago.',
};

interface ErrorPageProps {
  searchParams: Promise<PaymentReturnSearchParams>;
}

function firstReason(orderStatus?: string | null, rawStatus?: string | null) {
  return orderStatus || rawStatus || 'default';
}

function orderQuery(orderId?: string | null) {
  return orderId ? `?order_id=${encodeURIComponent(orderId)}` : '';
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const paymentReturn = await readPaymentReturn(searchParams);
  const order = paymentReturn.order;

  if (order?.payment_status === 'paid') {
    redirect(`/pago/exito${orderQuery(order.id)}`);
  }

  if (order?.payment_status === 'pending' || order?.payment_status === 'pending_payment') {
    redirect(`/pago/pendiente${orderQuery(order.id)}`);
  }

  const reason = firstReason(order?.payment_status, paymentReturn.rawStatus);
  const message = ERROR_MESSAGES[reason] ?? ERROR_MESSAGES.default;

  return (
    <main className="min-h-screen bg-primary px-4 py-6 text-primary">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-xl items-center">
        <section className="w-full rounded-[2rem] bg-white p-6 shadow-[0_28px_60px_rgba(0,0,0,0.18)] sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
              <AlertCircle className="h-10 w-10" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-primary/45">
              Pago no confirmado
            </p>
            <h1 className="mt-3 text-3xl font-bold text-primary">No se pudo cerrar el pedido</h1>
            <p className="mt-3 text-sm leading-relaxed text-primary/68">{message}</p>
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <CircleHelp className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">Qué revisar</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900/85">
                  <li className="flex items-start gap-2">
                    <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
                    Verificá los datos de tu tarjeta o elegí otro medio de pago.
                  </li>
                  <li className="flex items-start gap-2">
                    <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
                    Si querés, podés volver al menú y generar un nuevo intento.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.4rem] bg-primary/5 px-4 py-3 text-sm text-primary/64">
            Si el problema persiste, podés acercarte a caja o escribir a {STORE_INFO.contact.email}.
          </div>

          <div className="mt-8">
            <PaymentResultButtons
              primary={{ label: 'Volver a intentar', action: 'home', primary: true }}
              secondary={{ label: 'Volver al menú', action: 'home' }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
