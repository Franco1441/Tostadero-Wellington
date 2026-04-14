import 'server-only';
import { MercadoPagoConfig } from 'mercadopago';

let mpClient: MercadoPagoConfig | null = null;

export function getMPClient(): MercadoPagoConfig {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      'Mercado Pago no está configurado. Agregá MP_ACCESS_TOKEN en tus variables de entorno. Obtelo desde https://www.mercadopago.com.ar/developers/panel/app'
    );
  }

  if (!mpClient) {
    mpClient = new MercadoPagoConfig({ accessToken });
  }

  return mpClient;
}

export const isMPConfigured = (): boolean => Boolean(process.env.MP_ACCESS_TOKEN);
export const isMP_Configured = isMPConfigured;
