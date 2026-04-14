'use server';

import { headers } from 'next/headers';
import { Preference } from 'mercadopago';
import { getMPClient } from '@/lib/mercadopago';
import { menuItems } from '@/lib/menu-data';
import { attachPreferenceToOrder, createPendingOrder } from '@/lib/orders';
import { calculateCartPricing } from '@/lib/pricing';

async function getBaseUrl(): Promise<string> {
  // Primero intentar con NEXT_PUBLIC_APP_URL si está configurado y no es localhost
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }

  // Si no, obtener la URL del request actual
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  
  if (host) {
    return `${protocol}://${host}`;
  }

  // Fallback final
  return envUrl || 'https://localhost:3000';
}

interface CheckoutItemPayload {
  id: string;
  quantity: number;
}

interface CheckoutSessionPayload {
  items: CheckoutItemPayload[];
  customerName: string;
  orderType: 'para_llevar' | 'consumir_local' | null;
  couponCode?: string | null;
}

export interface MPPreferenceResult {
  orderId: string;
  preferenceId: string;
  initPoint: string;
}

export async function startMPCheckout(
  payload: CheckoutSessionPayload
): Promise<MPPreferenceResult> {
  const { items, customerName, orderType, couponCode } = payload;

  // Validaciones
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('El carrito está vacío.');
  }
  if (items.length > 50) {
    throw new Error('Demasiados productos en el carrito.');
  }
  if (!customerName.trim()) {
    throw new Error('Necesitamos un nombre para preparar el pedido.');
  }
  if (orderType !== 'para_llevar' && orderType !== 'consumir_local') {
    throw new Error('Seleccioná cómo querés recibir tu pedido.');
  }

  // Validar y enriquecer ítems desde el servidor (precio no manipulable)
  const validatedItems = items.map((item) => {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 99) {
      throw new Error(`Cantidad inválida para "${item.id}".`);
    }
    const menuItem = menuItems.find((m) => m.id === item.id);
    if (!menuItem) throw new Error(`Producto "${item.id}" no encontrado.`);
    return { ...menuItem, quantity: item.quantity };
  });

  const pricing = calculateCartPricing(validatedItems, couponCode);

  if (pricing.total <= 0) {
    throw new Error('No se pudo calcular el total del pedido.');
  }

  // Armar line_items para MP (uno por producto, con precio ya descontado proporcionalmente)
  const discountRatio = pricing.total / pricing.subtotal;
  const mpItems = validatedItems.map((item) => ({
    id: item.id,
    title: `${item.name} ${item.subtitle}`.trim(),
    description: item.description ?? undefined,
    quantity: item.quantity,
    unit_price: Math.round(item.price * discountRatio), // precio con descuento aplicado
    currency_id: 'ARS',
  }));

  const order = await createPendingOrder({
    customerName: customerName.trim(),
    orderType,
    items: validatedItems,
    pricing,
  });

  const metadata = {
    order_id: order.id,
    customer_name: customerName.trim(),
    order_type: orderType,
    coupon_code: pricing.appliedCouponCode ?? '',
    subtotal: pricing.subtotal,
    app_discount: pricing.appDiscount,
    coupon_discount: pricing.couponDiscount,
    total: pricing.total,
  };

  try {
    const baseUrl = await getBaseUrl();

    const preference = new Preference(getMPClient());
    const orderQuery = new URLSearchParams({ order_id: order.id }).toString();

    const response = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: customerName.trim(),
        },
        // URLs de retorno
        back_urls: {
          success: `${baseUrl}/pago/exito?${orderQuery}`,
          failure: `${baseUrl}/pago/error?${orderQuery}`,
          pending: `${baseUrl}/pago/pendiente?${orderQuery}`,
        },
        auto_return: 'approved',
        statement_descriptor: 'TOSTADERO WELLINGTON',
        external_reference: order.id,
        metadata,
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        // Medios de pago disponibles en Argentina
        payment_methods: {
          excluded_payment_types: [],
          installments: 1, // sin cuotas para una cafetería
        },
      },
    });

    const initPoint = response.init_point || response.sandbox_init_point;

    if (!response.id || !initPoint) {
      throw new Error('Mercado Pago no devolvió una preferencia válida.');
    }

    await attachPreferenceToOrder(order.id, response.id);

    return {
      orderId: order.id,
      preferenceId: response.id,
      initPoint,
    };
  } catch (error) {
    console.error('[MP] Error al crear preferencia:', error instanceof Error ? error.message : error);
    
    // Mensajes más específicos según el error
    if (error instanceof Error && error.message.includes('401')) {
      throw new Error('Error de autenticación con Mercado Pago. Verificá tu access token.');
    }
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('Mercado Pago tardó demasiado en responder. Intentá de nuevo.');
    }
    if (error instanceof Error && error.message.includes('orders')) {
      throw error;
    }
    
    throw new Error('Error al procesar el pago. Por favor, intentá de nuevo.');
  }
}
