"use client";

import { motion } from 'framer-motion';
import { promotions } from '@/lib/promotions-data';
import { Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { Category } from '@/lib/menu-data';

export function PromotionsCarousel({ category }: { category?: Category }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [flippedPromoId, setFlippedPromoId] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // noop
    }

    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const togglePromo = (promoId: string) => {
    setFlippedPromoId((current) => (current === promoId ? null : promoId));
  };

  const filtered = promotions.filter((promotion) => {
    if (!promotion.appliesToCategories?.length) {
      return true;
    }
    return category ? promotion.appliesToCategories.includes(category) : true;
  });

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section className="px-10 py-3 max-md:px-5 max-[430px]:px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-3 flex items-center gap-2"
      >
        <Sparkles size={16} className="text-primary" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary/50">
          Promociones
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.16 }}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-10 px-10 py-1 pb-2 max-md:-mx-5 max-md:px-5 max-[430px]:-mx-4 max-[430px]:px-4"
      >
        {filtered.map((promo, index) => {
          const badge = promo.badge ?? (promo.automatic ? 'Automática' : 'Cupón');
          const isFlipped = flippedPromoId === promo.id;

          return (
            <motion.article
              key={promo.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16 + index * 0.04 }}
              className="perspective-1000 h-[150px] w-[236px] shrink-0 snap-start max-md:h-[146px] max-md:w-[212px] max-[430px]:h-[140px] max-[430px]:w-[190px]"
              role="button"
              tabIndex={0}
              aria-pressed={isFlipped}
              aria-label={`${isFlipped ? 'Cerrar' : 'Ver'} promoción ${promo.title}`}
              onClick={() => togglePromo(promo.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  togglePromo(promo.id);
                }
              }}
            >
              <motion.div
                className="relative h-full w-full will-change-transform"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring', damping: 24, stiffness: 260 }}
                style={{
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                }}
              >
                <div
                  className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-br from-primary via-primary to-[#1b5fc1] p-4 text-white shadow-[0_14px_28px_rgba(12,76,161,0.2)] backface-hidden max-[430px]:p-3.5"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translateZ(1px)',
                  }}
                >
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/10" />
                  <div className="absolute -left-6 bottom-4 h-12 w-12 rounded-full bg-white/8" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_44%)]" />

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <p className="line-clamp-2 min-w-0 text-[12px] leading-tight text-white/78 max-[430px]:text-[11px]">
                      {promo.description}
                    </p>
                    <span className="shrink-0 rounded-full bg-white/22 px-2 py-0.5 text-[10px] font-bold text-white max-[430px]:text-[9px]">
                      {badge}
                    </span>
                  </div>

                  <div className="relative z-10 mt-3 flex-1">
                    <h3 className="line-clamp-2 font-serif text-[22px] leading-[0.95] text-white max-[430px]:text-[19px]">
                      {promo.title}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-end justify-between gap-3">
                    <p className="min-w-0 text-[28px] font-black leading-none tracking-tight text-white max-[430px]:text-[24px]">
                      {promo.discountLabel}
                    </p>
                  </div>
                </div>

                <div
                  className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-br from-primary via-primary to-[#1b5fc1] p-4 text-white shadow-[0_14px_28px_rgba(12,76,161,0.2)] backface-hidden max-[430px]:p-3.5"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(1px)',
                  }}
                >
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/10" />
                  <div className="absolute -left-6 bottom-4 h-12 w-12 rounded-full bg-white/8" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_44%)]" />

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/58">
                      {promo.code ? 'Copialo al pagar' : 'Promo automática'}
                    </p>
                    <span className="rounded-full bg-white/22 px-2 py-0.5 text-[10px] font-bold text-white max-[430px]:text-[9px]">
                      {badge}
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto flex flex-1 flex-col justify-center">
                    <h3 className="line-clamp-2 font-serif text-[22px] leading-[0.95] text-white max-[430px]:text-[19px]">
                      {promo.title}
                    </h3>
                    {promo.code ? null : (
                      <div className="mt-4 rounded-[20px] border border-white/18 bg-white/12 px-4 py-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/58">
                          Estado
                        </p>
                        <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-white">
                          Ya aplicado
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 mt-4">
                    {promo.code ? (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={(event) => {
                          event.stopPropagation();
                          copyCode(promo.code!);
                        }}
                        className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors max-[430px]:h-10 max-[430px]:text-xs ${
                          copiedCode === promo.code
                            ? 'border-primary bg-white text-primary'
                            : 'border-white/35 bg-white/14 text-white hover:bg-white/18'
                        }`}
                        aria-label={`Copiar código ${promo.code}`}
                      >
                        <Copy size={14} className="max-[430px]:h-3 max-[430px]:w-3" />
                        <span className="truncate">
                          {copiedCode === promo.code ? 'Copiado' : `Copiar ${promo.code}`}
                        </span>
                      </motion.button>
                    ) : (
                      <span className="inline-flex h-10 w-full items-center justify-center rounded-full bg-white/16 px-4 text-xs font-bold uppercase tracking-[0.18em] text-white/78 max-[430px]:h-9 max-[430px]:text-[10px]">
                        Se aplica sola
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
