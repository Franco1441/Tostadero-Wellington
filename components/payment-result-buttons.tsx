'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Printer, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';

type PaymentResultAction = 'home' | 'reload' | 'print';

interface ActionConfig {
  label: string;
  action: PaymentResultAction;
  primary?: boolean;
}

interface PaymentResultButtonsProps {
  primary: ActionConfig;
  secondary?: ActionConfig;
  clearCartOnMount?: boolean;
}

function ActionButton({ label, action, primary = false }: ActionConfig) {
  const className = cn(
    'flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-center font-semibold transition-colors',
    primary
      ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90'
      : 'border border-primary/12 bg-white text-primary hover:bg-primary/5',
  );

  if (action === 'home') {
    return (
      <Link href="/" className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (action === 'reload') {
          window.location.reload();
        } else if (action === 'print') {
          window.print();
        }
      }}
      className={className}
    >
      {action === 'reload' ? <RefreshCw className="h-4 w-4" /> : null}
      {action === 'print' ? <Printer className="h-4 w-4" /> : null}
      {label}
    </button>
  );
}

export function PaymentResultButtons({
  primary,
  secondary,
  clearCartOnMount = false,
}: PaymentResultButtonsProps) {
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (clearCartOnMount) {
      clearCart();
    }
  }, [clearCart, clearCartOnMount]);

  return (
    <div className="space-y-3">
      <ActionButton {...primary} />
      {secondary ? <ActionButton {...secondary} /> : null}
    </div>
  );
}
