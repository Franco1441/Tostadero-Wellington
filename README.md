# Tostadero Wellington

Aplicacion full stack para take-away ordering con checkout de Mercado Pago, gestion de pedidos y soporte para operacion interna del local.

## Demo
- Produccion: https://skill-deploy-92740275le.vercel.app
- Repo: https://github.com/Franco1441/Tostadero-Wellington

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Supabase (opcional para persistencia/auth)
- Mercado Pago SDK

## Funcionalidades principales
- Catalogo de productos y experiencia de compra mobile-first
- Carrito con persistencia local
- Cupones y logica de descuentos
- Checkout integrado con Mercado Pago
- Paginas de estado de pago (`/pago/exito`, `/pago/error`, `/pago/pendiente`)
- Webhook para sincronizacion de estado de pagos
- Panel interno de pedidos en `/local/pedidos`

## Variables de entorno
Crear `.env.local` a partir de `.env.example` y completar:

- `MP_ACCESS_TOKEN`
- `NEXT_PUBLIC_MP_PUBLIC_KEY`
- `NEXT_PUBLIC_APP_URL`
- `MP_WEBHOOK_SECRET`
- `LOCAL_DASHBOARD_KEY` (opcional)
- `NEXT_PUBLIC_SUPABASE_URL` (opcional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (opcional)
- `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_SECRET_KEY` (opcional)

## Ejecutar en local
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Scripts utiles
- `npm run dev` - entorno local
- `npm run build` - build de produccion
- `npm run start` - run de build
- `npm run lint` - ESLint
- `npm run typecheck` - chequeo TypeScript
- `npm run check` - lint + typecheck + build

## Estructura clave
- `app/` - rutas, pages, server actions y APIs
- `app/api/mercadopago/webhook/route.ts` - webhook de pagos
- `app/actions/mercadopago.ts` - inicio de checkout
- `components/` - componentes de UI y flujo
- `lib/` - utilidades, pricing, supabase, Mercado Pago
- `supabase/migrations/` - migraciones SQL

## Documentacion adicional
- `MERCADOPAGO_MIGRATION.md`
- `docs/mercadopago-setup.md`
- `docs/testing-mercadopago.md`

## Autor
Desarrollado por Franco Rotta.