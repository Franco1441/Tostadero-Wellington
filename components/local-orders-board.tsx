'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrderFulfillmentStatus, OrderPaymentStatus, OrderRecord } from '@/lib/orders';
import { RefreshCw } from 'lucide-react';

interface LocalOrdersBoardProps {
  initialOrders: OrderRecord[];
  initialFilter: string;
  initialErrorMessage?: string | null;
  accessKey?: string | null;
}

interface StatusFilter {
  id: string;
  label: string;
  statuses: OrderPaymentStatus[];
}

const STATUS_FILTERS: StatusFilter[] = [
  { id: 'all', label: 'Todos', statuses: [] },
  { id: 'pending_payment,pending', label: 'Pendientes', statuses: ['pending_payment', 'pending'] },
  { id: 'paid', label: 'Pagados', statuses: ['paid'] },
  {
    id: 'rejected,cancelled,refunded',
    label: 'Con problema',
    statuses: ['rejected', 'cancelled', 'refunded'],
  },
];

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

function getStatusLabel(status: OrderPaymentStatus) {
  switch (status) {
    case 'pending_payment':
      return 'Esperando pago';
    case 'pending':
      return 'Pago pendiente';
    case 'paid':
      return 'Pagado';
    case 'rejected':
      return 'Rechazado';
    case 'cancelled':
      return 'Cancelado';
    case 'refunded':
      return 'Devuelto';
    default:
      return status;
  }
}

function getStatusStyles(status: OrderPaymentStatus) {
  switch (status) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'pending':
    case 'pending_payment':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-rose-100 text-rose-700 border-rose-200';
  }
}

function getFulfillmentLabel(status: OrderFulfillmentStatus) {
  switch (status) {
    case 'new':
      return 'Sin preparar';
    case 'preparing':
      return 'En preparación';
    case 'ready_for_pickup':
      return 'Listo para retirar';
    case 'completed':
      return 'Entregado';
    default:
      return status;
  }
}

function getFulfillmentStyles(status: OrderFulfillmentStatus) {
  switch (status) {
    case 'new':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'preparing':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'ready_for_pickup':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'completed':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function formatRelativeTime(timestamp: string) {
  const createdAt = new Date(timestamp).getTime();
  const now = Date.now();
  const diffMs = Math.max(now - createdAt, 0);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'ahora';
  }

  if (diffMinutes < 60) {
    return `hace ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `hace ${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `hace ${diffDays} d`;
}

function getOrdersPanelErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.toLowerCase().includes('fetch failed') || message.includes('(500)')) {
    return 'No se pudo conectar con la base de pedidos. El panel está activo, pero todavía no puede sincronizar pedidos.';
  }

  return message || 'No se pudieron cargar los pedidos.';
}

export function LocalOrdersBoard({
  initialOrders,
  initialFilter,
  initialErrorMessage = null,
  accessKey,
}: LocalOrdersBoardProps) {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);

  const filter = useMemo(
    () => STATUS_FILTERS.find((entry) => entry.id === activeFilter) ?? STATUS_FILTERS[0],
    [activeFilter],
  );

  const fetchOrders = useCallback(async (filterValue: string) => {
    setIsRefreshing(true);

    try {
      const params = new URLSearchParams();
      params.set('limit', '100');

      if (filterValue !== 'all') {
        params.set('status', filterValue);
      }

      if (accessKey) {
        params.set('key', accessKey);
      }

      const response = await fetch(`/api/orders?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const payload = (await response.json()) as {
        orders?: OrderRecord[];
        generatedAt?: string;
        error?: string;
      };

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? `No se pudieron actualizar los pedidos (${response.status}).`);
      }

      setOrders(payload.orders ?? []);
      setLastUpdated(payload.generatedAt ?? new Date().toISOString());
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(getOrdersPanelErrorMessage(error));
    } finally {
      setIsRefreshing(false);
    }
  }, [accessKey]);

  const updateOrderAction = useCallback(
    async (orderId: string, action: 'preparing' | 'ready_for_pickup' | 'completed') => {
      setUpdatingOrderId(orderId);

      try {
        const params = new URLSearchParams();
        if (accessKey) {
          params.set('key', accessKey);
        }

        const response = await fetch(
          `/api/orders/${orderId}${params.toString() ? `?${params.toString()}` : ''}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action }),
          },
        );

        const payload = (await response.json()) as { order?: OrderRecord; error?: string };

        if (!response.ok || payload.error || !payload.order) {
          throw new Error(payload.error ?? `No se pudo actualizar el pedido (${response.status}).`);
        }

        setOrders((previous) =>
          previous.map((order) => (order.id === payload.order?.id ? payload.order : order)),
        );
        setErrorMessage(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar el pedido.';
        setErrorMessage(message);
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [accessKey],
  );

  useEffect(() => {
    void fetchOrders(activeFilter);
    const intervalId = window.setInterval(() => {
      void fetchOrders(activeFilter);
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeFilter, fetchOrders]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
      <section className="rounded-3xl border border-primary/20 bg-white/90 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/60">Panel Local</p>
            <h1 className="text-2xl font-bold text-primary">Pedidos en vivo</h1>
            <p className="text-sm text-primary/70">Última actualización: {new Date(lastUpdated).toLocaleTimeString('es-AR')}</p>
          </div>
          <button
            type="button"
            onClick={() => void fetchOrders(activeFilter)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActiveFilter(entry.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                activeFilter === entry.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-primary/20 bg-white text-primary hover:bg-primary/5'
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </section>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <section className="mt-4 grid gap-3 pb-8">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-white px-4 py-10 text-center text-sm font-semibold text-primary/60">
            No hay pedidos para el filtro {filter.label.toLowerCase()}.
          </div>
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-primary/10 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-primary">{order.customer_name || 'Sin nombre'}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/60">
                    Pedido {order.id.slice(0, 8)} · {formatRelativeTime(order.created_at)}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getStatusStyles(
                    order.payment_status,
                  )}`}
                >
                  {getStatusLabel(order.payment_status)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-primary/80">
                  {order.item_count} {order.item_count === 1 ? 'producto' : 'productos'} · {order.order_type === 'para_llevar' ? 'Take away' : 'En local'}
                </p>
                <p className="text-xl font-black text-primary">{CURRENCY_FORMATTER.format(order.total)}</p>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${getFulfillmentStyles(
                    order.fulfillment_status,
                  )}`}
                >
                  {getFulfillmentLabel(order.fulfillment_status)}
                </span>
                {order.customer_arriving_at ? (
                  <span className="rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-indigo-700">
                    Cliente en camino
                  </span>
                ) : null}
              </div>

              <ul className="mt-3 space-y-1">
                {order.items.slice(0, 3).map((item) => (
                  <li key={`${order.id}-${item.id}`} className="flex items-center justify-between text-sm text-primary/80">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold">{CURRENCY_FORMATTER.format(item.line_total)}</span>
                  </li>
                ))}
              </ul>

              {order.items.length > 3 ? (
                <p className="mt-1 text-xs font-semibold text-primary/60">+{order.items.length - 3} productos más</p>
              ) : null}

              {order.payment_status === 'paid' ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {order.fulfillment_status === 'new' ? (
                    <button
                      type="button"
                      onClick={() => void updateOrderAction(order.id, 'preparing')}
                      disabled={updatingOrderId === order.id}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {updatingOrderId === order.id ? 'Actualizando...' : 'Marcar en preparación'}
                    </button>
                  ) : null}

                  {order.fulfillment_status === 'preparing' ? (
                    <button
                      type="button"
                      onClick={() => void updateOrderAction(order.id, 'ready_for_pickup')}
                      disabled={updatingOrderId === order.id}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {updatingOrderId === order.id ? 'Actualizando...' : 'Marcar listo para retirar'}
                    </button>
                  ) : null}

                  {order.fulfillment_status === 'ready_for_pickup' ? (
                    <button
                      type="button"
                      onClick={() => void updateOrderAction(order.id, 'completed')}
                      disabled={updatingOrderId === order.id}
                      className="rounded-full bg-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {updatingOrderId === order.id ? 'Actualizando...' : 'Marcar entregado'}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
