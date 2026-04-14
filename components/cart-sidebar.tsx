'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/menu-data';
import { CheckoutModal } from './checkout-modal';
import { useState } from 'react';

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem,
    updateQuantity,
    subtotal,
    total,
    appDiscount,
    couponDiscount,
    appliedCouponCode,
    removeCoupon,
  } = useCartStore();

  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      closeCart();
      return;
    }
    closeCart();
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/50 z-[110]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-primary z-[120] flex flex-col max-md:max-w-full"
            >
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between flex-shrink-0">
                <h2 className="font-serif text-3xl text-white italic">Tu Pedido</h2>
                <button 
                  onClick={closeCart}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0">
                {items.length === 0 ? (
                    <div className="text-center py-16 text-white/60">
                    <p className="text-lg">Tu carrito está vacío</p>
                    <p className="text-sm mt-2">Agregá productos del menú</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex justify-between items-center py-4 gap-3">
                          {/* Nombre y precio */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-base leading-tight">
                              {item.name}
                              {item.subtitle ? ` ${item.subtitle}` : ''}
                            </p>
                            <p className="text-white/70 text-sm mt-0.5">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          {/* Controles de cantidad + eliminar */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center bg-white/15 rounded-full">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                                aria-label={`Restar una unidad de ${item.name} ${item.subtitle}`}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="text-white font-bold text-sm w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                                aria-label={`Sumar una unidad de ${item.name} ${item.subtitle}`}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                              aria-label={`Eliminar ${item.name} ${item.subtitle}`}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                        <div className="border-b border-dashed border-white/20" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 pt-4 pb-8 space-y-3 border-t border-white/30 flex-shrink-0"
                  style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}
                >
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Subtotal:</span>
                    <span className="text-white/60 text-sm">{formatPrice(subtotal)}</span>
                  </div>

                  {/* App discount */}
                  {appDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-300 text-sm font-medium">Descuento App 10%:</span>
                      <span className="text-green-300 text-sm font-medium">-{formatPrice(appDiscount)}</span>
                    </div>
                  )}

                  {/* Coupon discount */}
                  {couponDiscount > 0 && appliedCouponCode && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-green-200 text-sm font-medium">Cupón {appliedCouponCode}:</span>
                        <button
                          onClick={() => removeCoupon()}
                          className="text-sm text-white/60 hover:text-white bg-white/5 px-2 py-0.5 rounded"
                        >
                          Quitar
                        </button>
                      </div>
                      <span className="text-green-200 text-sm font-medium">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="border-b border-dashed border-white/30" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xl font-bold">Total:</span>
                    <span className="text-white text-3xl font-bold">{formatPrice(total)}</span>
                  </div>

                  {/* Boton */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleCheckout}
                    className="w-full bg-white text-primary py-4 rounded-full font-bold text-lg hover:bg-white/95 transition-all shadow-xl mt-1"
                  >
                    Ir a pagar
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal isOpen={showCheckout} onClose={handleCloseCheckout} />
    </>
  );
}
