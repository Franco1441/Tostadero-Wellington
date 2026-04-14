'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrderFulfillmentStatus } from '@/lib/orders';

interface CustomerArrivalCardProps {
  orderId: string;
  initialArrivalAt: string | null;
  fulfillmentStatus: OrderFulfillmentStatus;
}

function getFulfillmentMessage(status: OrderFulfillmentStatus) {
  switch (status) {
    case 'new':
      return 'Avisanos cuando estés llegando así empezamos a preparar tu café y te lo llevás caliente.';
    case 'preparing':
      return 'Estamos preparando tu pedido en este momento.';
    case 'ready_for_pickup':
      return 'Tu pedido ya está listo para retirar.';
    case 'completed':
      return 'Este pedido figura como entregado.';
    default:
      return 'Estado del pedido actualizado.';
  }
}

function getFulfillmentLabel(status: OrderFulfillmentStatus) {
  switch (status) {
    case 'new':
      return 'Pedido confirmado';
    case 'preparing':
      return 'En preparación';
    case 'ready_for_pickup':
      return 'Listo para retirar';
    case 'completed':
      return 'Entregado';
    default:
      return 'Actualizando estado';
  }
}

const FULFILLMENT_STEPS: Array<{ status: OrderFulfillmentStatus; label: string }> = [
  { status: 'new', label: 'Confirmado' },
  { status: 'preparing', label: 'Preparando' },
  { status: 'ready_for_pickup', label: 'Listo' },
];

function stepIndex(status: OrderFulfillmentStatus) {
  switch (status) {
    case 'new':
      return 0;
    case 'preparing':
      return 1;
    case 'ready_for_pickup':
    case 'completed':
      return 2;
    default:
      return 0;
  }
}

export function CustomerArrivalCard({
  orderId,
  initialArrivalAt,
  fulfillmentStatus,
}: CustomerArrivalCardProps) {
  const [arrivalAt, setArrivalAt] = useState<string | null>(initialArrivalAt);
  const [liveStatus, setLiveStatus] = useState<OrderFulfillmentStatus>(fulfillmentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const statusMessage = useMemo(() => getFulfillmentMessage(liveStatus), [liveStatus]);
  const currentStatusLabel = useMemo(() => getFulfillmentLabel(liveStatus), [liveStatus]);
  const alreadyNotified = Boolean(arrivalAt);
  const isPreparing = liveStatus === 'preparing';
  const isReadyForPickup = liveStatus === 'ready_for_pickup';

  const refreshOrderStatus = useCallback(async () => {
    setIsSyncing(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const payload = (await response.json()) as {
        order?: {
          fulfillment_status?: OrderFulfillmentStatus;
          customer_arriving_at?: string | null;
        };
        error?: string;
      };

      if (!response.ok || payload.error || !payload.order) {
        throw new Error(payload.error ?? `No se pudo obtener el estado (${response.status}).`);
      }

      if (payload.order.fulfillment_status) {
        setLiveStatus(payload.order.fulfillment_status);
      }

      if (payload.order.customer_arriving_at) {
        setArrivalAt(payload.order.customer_arriving_at);
      }

      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el estado.';
      setErrorMessage(message);
    } finally {
      setIsSyncing(false);
    }
  }, [orderId]);

  useEffect(() => {
    setLiveStatus(fulfillmentStatus);
  }, [fulfillmentStatus]);

  useEffect(() => {
    void refreshOrderStatus();

    const intervalId = window.setInterval(() => {
      void refreshOrderStatus();
    }, 8000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshOrderStatus]);

  async function notifyArrival() {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'customer_arriving' }),
      });

      const payload = (await response.json()) as {
        order?: {
          customer_arriving_at: string | null;
          fulfillment_status?: OrderFulfillmentStatus;
        };
        error?: string;
      };

      if (!response.ok || payload.error || !payload.order) {
        throw new Error(payload.error ?? `No se pudo avisar al local (${response.status}).`);
      }

      setArrivalAt(payload.order.customer_arriving_at ?? new Date().toISOString());
      if (payload.order.fulfillment_status) {
        setLiveStatus(payload.order.fulfillment_status);
      }
      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo avisar al local.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-4 rounded-[1.6rem] border border-primary/10 bg-primary/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/45">Seguimiento</p>
      <p className="mt-2 text-sm font-semibold text-primary">{statusMessage}</p>

      {isReadyForPickup ? (
        <div className="mt-3 rounded-2xl border border-emerald-300 bg-emerald-500 px-4 py-3 text-white shadow-[0_10px_24px_rgba(16,185,129,0.32)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">Listo para retirar</p>
          <p className="mt-1 text-base font-extrabold">Tu pedido está listo. Podés venir a buscarlo ahora.</p>
        </div>
      ) : null}

      {isPreparing ? (
        <div className="mt-3 rounded-2xl border border-primary/20 bg-primary px-4 py-3 text-white shadow-[0_10px_24px_rgba(47,86,170,0.25)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">En preparación</p>
          <p className="mt-1 text-sm font-semibold">Estamos preparando tu pedido para que lo retires caliente.</p>
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-white px-3 py-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/45">
            Actualización en vivo
          </p>
          <p className="truncate text-sm font-bold text-primary">{currentStatusLabel}</p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary/65">
          <span className={`h-2.5 w-2.5 rounded-full bg-emerald-500 ${isSyncing ? 'animate-pulse' : ''}`} />
          {isSyncing ? 'sincronizando...' : 'en línea'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {FULFILLMENT_STEPS.map((step, index) => {
          const activeIndex = stepIndex(liveStatus);
          const isCompleted = index <= activeIndex;

          return (
            <div
              key={step.status}
              className={`rounded-xl border px-2 py-2 text-center ${
                isCompleted
                  ? 'border-primary/20 bg-primary text-white'
                  : 'border-primary/12 bg-white text-primary/50'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.12em]">{step.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void notifyArrival()}
          disabled={alreadyNotified || isSubmitting}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {alreadyNotified ? 'Ya avisaste que estás llegando' : isSubmitting ? 'Avisando...' : 'Avisar que estoy llegando'}
        </button>
        {arrivalAt ? (
          <p className="text-xs font-semibold text-primary/65">
            Aviso enviado: {new Date(arrivalAt).toLocaleTimeString('es-AR')}
          </p>
        ) : null}
      </div>

      {errorMessage ? <p className="mt-3 text-xs font-semibold text-rose-600">{errorMessage}</p> : null}
    </section>
  );
}
