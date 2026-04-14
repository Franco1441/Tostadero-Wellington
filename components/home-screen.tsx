'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock3, MapPin, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { categories, homeFeaturedItemIds, menuItems, type Category } from '@/lib/menu-data';
import { STORE_INFO, getCompactHours } from '@/lib/store-info';
import { cn } from '@/lib/utils';

interface HomeScreenProps {
  onSelectCategory: (category: Category) => void;
  onOpenCart: () => void;
  canOrder: boolean;
}

const featuredItems = homeFeaturedItemIds
  .map((id) => menuItems.find((item) => item.id === id))
  .filter((item): item is NonNullable<typeof item> => Boolean(item));

export function HomeScreen({ onSelectCategory, onOpenCart, canOrder }: HomeScreenProps) {
  return (
    <main
      className={cn(
        'flex-1 overflow-y-auto bg-gradient-to-b from-primary/5 to-transparent md:pb-40',
        canOrder
          ? 'pb-[calc(8.75rem+env(safe-area-inset-bottom))]'
          : 'pb-[calc(6.5rem+env(safe-area-inset-bottom))]',
      )}
    >
      <section className="px-6 max-[430px]:px-4 pb-5 pt-6 md:px-10 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-5 md:grid-cols-[1.4fr_0.9fr] md:items-end"
        >
          <div>
            <p className="text-[2.2rem] leading-tight text-primary" style={{ fontWeight: 500 }}>
              {STORE_INFO.heroKicker}
            </p>
            <span className="block font-serif text-[3.5rem] leading-tight text-primary">
              {STORE_INFO.name}
            </span>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/65 md:text-base">
              {canOrder
                ? 'Pedí antes de llegar, elegí tus favoritos y retiralos sin esperar.'
                : 'Mirá la carta completa, descubrí favoritos y después hacé tu pedido en caja.'}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 md:flex md:flex-wrap">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.05 }}
                  onClick={() => onSelectCategory(category.id)}
                  className="rounded-[22px] border border-primary/12 bg-white px-4 py-3 text-left text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:rounded-full md:px-5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/45">
                    Ver
                  </span>
                  <span className="mt-1 block font-serif text-2xl leading-none">
                    {category.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[28px] bg-primary px-6 py-6 text-white shadow-[0_20px_60px_rgba(12,76,161,0.18)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
              {canOrder ? 'Pedido rápido' : 'Solo carta'}
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight">
              {canOrder
                ? 'Todo listo para pasar, retirar y seguir.'
                : 'Explorá tranquilo y después pedilo directo en caja.'}
            </h2>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <Clock3 size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">Horarios</p>
                  <p className="mt-1 text-sm font-semibold leading-6">{getCompactHours()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">Dirección</p>
                  <p className="mt-1 text-sm font-semibold leading-6">
                    {STORE_INFO.address.street}
                    <br />
                    {STORE_INFO.address.city}, {STORE_INFO.address.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSelectCategory('frios')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5"
              >
                Ir al menú
                <ArrowRight size={16} />
              </button>
              {canOrder ? (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  <ShoppingBag size={16} />
                  Ver carrito
                </button>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-6 max-[430px]:px-4 pb-10 pt-2 md:px-10">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary/50">
            Favoritos del día
          </h2>
          <span className="text-[11px] font-medium text-primary/45 md:hidden">
            {canOrder ? 'Toque rápido para sumar' : 'Tocá para ver info'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:flex md:gap-4 md:overflow-x-auto md:scrollbar-hide">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 + index * 0.05 }}
              className="py-2 md:flex-shrink-0"
            >
              <ProductCard item={item} canOrder={canOrder} />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
