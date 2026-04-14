'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/menu-data';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: 'home' | 'menu';
  onTabChange: (tab: 'home' | 'menu') => void;
  canOrder: boolean;
}

export function BottomNav({ activeTab, onTabChange, canOrder }: BottomNavProps) {
  const { openCart, getItemCount, total } = useCartStore();
  const itemCount = getItemCount();

  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menú' },
  ] as const;

  return (
    <>
      <AnimatePresence>
        {canOrder && itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-[calc(5.2rem+env(safe-area-inset-bottom))] left-4 right-4 z-[105] md:hidden"
          >
            <button
              type="button"
              onClick={openCart}
              className="flex w-full items-center justify-between rounded-[24px] bg-primary px-4 py-3 text-left text-white shadow-[0_20px_50px_rgba(12,76,161,0.28)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/14">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">Ver pedido</p>
                  <p className="mt-1 text-xs text-white/70">
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
              <span className="font-serif text-2xl leading-none">{formatPrice(total)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', damping: 20 }}
        className="fixed bottom-3 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-primary/10 bg-white/92 shadow-[0_18px_40px_rgba(12,76,161,0.14)] backdrop-blur"
        style={{ paddingBottom: 'max(0.45rem, env(safe-area-inset-bottom, 0.45rem))' }}
      >
        <div className="mx-auto flex items-center gap-2 px-2 pt-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              aria-label={`Ir a ${tab.label}`}
              className={cn(
                'relative flex min-w-0 items-center gap-2 rounded-full px-4 py-3 transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-[0_12px_24px_rgba(12,76,161,0.24)]'
                  : 'text-primary/42 hover:text-primary/70',
              )}
            >
              <tab.icon
                size={20}
                strokeWidth={activeTab === tab.id ? 2.5 : 1.8}
                className="relative z-10"
              />
              <span className="relative z-10 truncate text-[11px] font-semibold">{tab.label}</span>
            </motion.button>
          ))}

          {canOrder ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={openCart}
              aria-label="Abrir carrito"
              className="relative flex items-center justify-center rounded-full px-3 py-3 text-primary/56 transition-colors hover:text-primary"
            >
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={1.8} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-2.5 -top-2 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-primary text-[9px] font-bold text-white shadow"
                    >
                      {itemCount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[10px] font-semibold">Carrito</span>
            </motion.button>
          ) : null}
        </div>
      </motion.nav>
    </>
  );
}
