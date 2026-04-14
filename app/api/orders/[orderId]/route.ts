import { NextRequest, NextResponse } from 'next/server';
import {
  getOrderById,
  markCustomerArriving,
  markOrderAsCompleted,
  markOrderAsPreparing,
  markOrderAsReadyForPickup,
} from '@/lib/orders';

type OrderAction = 'preparing' | 'ready_for_pickup' | 'completed' | 'customer_arriving';

const LOCAL_ACTIONS: OrderAction[] = ['preparing', 'ready_for_pickup', 'completed'];
const CUSTOMER_ACTIONS: OrderAction[] = ['customer_arriving'];

function isDashboardAuthorized(request: NextRequest) {
  const configuredKey = process.env.LOCAL_DASHBOARD_KEY?.trim();

  if (!configuredKey) {
    return true;
  }

  const keyFromQuery = request.nextUrl.searchParams.get('key')?.trim();
  const keyFromHeader = request.headers.get('x-local-dashboard-key')?.trim();

  return keyFromQuery === configuredKey || keyFromHeader === configuredKey;
}

function isOrderAction(value: unknown): value is OrderAction {
  return (
    value === 'preparing' ||
    value === 'ready_for_pickup' ||
    value === 'completed' ||
    value === 'customer_arriving'
  );
}

async function readOrderId(context: { params: Promise<{ orderId: string }> | { orderId: string } }) {
  const params = await Promise.resolve(context.params);
  return params.orderId;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orderId: string }> | { orderId: string } },
) {
  const orderId = await readOrderId(context);
  const order = await getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> | { orderId: string } },
) {
  const orderId = await readOrderId(context);
  const body = (await request.json().catch(() => ({}))) as { action?: unknown };
  const action = body.action;

  if (!isOrderAction(action)) {
    return NextResponse.json({ error: 'Acción inválida.' }, { status: 400 });
  }

  if (LOCAL_ACTIONS.includes(action) && !isDashboardAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });
  }

  if (order.payment_status !== 'paid') {
    return NextResponse.json(
      { error: 'El pedido todavía no está pagado. No se puede cambiar su estado operativo.' },
      { status: 409 },
    );
  }

  try {
    let updatedOrder = order;

    if (action === 'preparing') {
      updatedOrder = await markOrderAsPreparing(orderId);
    } else if (action === 'ready_for_pickup') {
      updatedOrder = await markOrderAsReadyForPickup(orderId);
    } else if (action === 'completed') {
      updatedOrder = await markOrderAsCompleted(orderId);
    } else if (CUSTOMER_ACTIONS.includes(action)) {
      updatedOrder = await markCustomerArriving(orderId);
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar el pedido.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
