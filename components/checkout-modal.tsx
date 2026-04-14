'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ExternalLink, X, ShoppingBag, CreditCard, ChevronLeft } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/menu-data';
import { startMPCheckout } from '@/app/actions/mercadopago';
import { PROMOTIONS_ENABLED } from '@/lib/feature-flags';
import { cn } from '@/lib/utils';

type CheckoutStep = 'cart' | 'payment';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'cart', label: 'Pedido', icon: ShoppingBag },
  { id: 'payment', label: 'Pago', icon: CreditCard },
] as const;

function StepIndicator({ currentStep, steps }: { currentStep: CheckoutStep; steps: typeof STEPS }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-3 px-5 pb-4 pt-1 sm:gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.id === currentStep;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors',
                  isCompleted && 'border-green-600 bg-green-600 text-white',
                  isCurrent && 'border-primary bg-primary text-white',
                  !isCompleted && !isCurrent && 'border-gray-200 bg-white text-gray-400',
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                {isCurrent ? (
                  <motion.div
                    layoutId="step-ring"
                    className="absolute inset-[-6px] rounded-full border border-primary/20"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                ) : null}
              </div>

              <span
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-[0.14em]',
                  isCompleted && 'text-green-600',
                  isCurrent && 'text-primary',
                  !isCompleted && !isCurrent && 'text-gray-400',
                )}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 ? (
              <div
                className={cn(
                  'h-[2px] w-9 rounded-full sm:w-12',
                  isCompleted ? 'bg-green-600' : 'bg-gray-200',
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const {
    items, subtotal, total,
    appDiscount, couponDiscount, appliedCouponCode,
    applyCoupon, removeCoupon,
  } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [initPoint, setInitPoint] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const canDismiss = !isCreatingPreference;
  const currentStep: CheckoutStep = items.length === 0 ? 'cart' : step;

  const resetFlow = useCallback(() => {
    setStep('cart'); setCustomerName('');
    setIsCreatingPreference(false); setInitPoint(null);
    setOrderId(null); setPaymentError(null);
    setCouponInput(''); setCouponMessage(null);
  }, []);

  const handleClose = useCallback(() => {
    if (!canDismiss) return;
    resetFlow(); onClose();
  }, [canDismiss, onClose, resetFlow]);

  const handleCouponApply = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput.trim());
    setCouponMessage(result.message);
    if (result.success) setCouponInput('');
    window.setTimeout(() => setCouponMessage(null), 3000);
  };

  const handleProceedToPayment = async () => {
    if (!customerName.trim()) return;
    setIsCreatingPreference(true);
    setPaymentError(null);
    try {
      const result = await startMPCheckout({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        customerName: customerName.trim(),
        orderType: 'para_llevar',
        couponCode: appliedCouponCode,
      });
      setOrderId(result.orderId);
      setInitPoint(result.initPoint);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al iniciar el pago.';
      setPaymentError(errorMsg);
    } finally {
      setIsCreatingPreference(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={canDismiss ? handleClose : undefined}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-0 sm:p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="h-[100dvh] w-full overflow-y-auto bg-white sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl"
          role="dialog" aria-modal="true" aria-labelledby="checkout-title"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-white sm:rounded-t-3xl">
            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                {currentStep !== 'cart' && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    type="button"
                    onClick={() => {
                      if (currentStep === 'payment') {
                        setInitPoint(null);
                        setOrderId(null);
                        setPaymentError(null);
                        setStep('cart');
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-primary hover:bg-gray-200 transition-colors"
                    aria-label="Volver"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                )}
                <h2 id="checkout-title" className="text-xl font-bold text-primary">
                  {currentStep === 'cart' && 'Tu pedido'}
                  {currentStep === 'payment' && (initPoint ? 'Abrir Mercado Pago' : 'Confirmar pago')}
                </h2>
              </div>
              {canDismiss && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            {items.length > 0 && (
              <StepIndicator currentStep={currentStep} steps={STEPS} />
            )}
          </div>

          <div className="p-5 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-10">
            <AnimatePresence mode="wait">

              {/* CARRITO */}
              {currentStep === 'cart' && (
                <motion.div key="cart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100"
                      >
                        <ShoppingBag className="h-12 w-12 text-gray-300" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-primary mb-2">Tu carrito esta vacio</h3>
                      <p className="text-gray-500 mb-6">Agrega productos del menu para comenzar</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleClose}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
                      >
                        Ver menu
                      </motion.button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center justify-between rounded-2xl bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-bold text-primary">{item.name} {item.subtitle}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-bold text-primary">
                                  {item.quantity}
                                </span>
                                <span className="text-sm text-gray-500">x {formatPrice(item.price)}</span>
                              </div>
                            </div>
                            <p className="text-lg font-bold text-primary">{formatPrice(item.quantity * item.price)}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2 border-t-2 pt-4">
                        {PROMOTIONS_ENABLED ? (
                          <>
                            <div className="flex items-center gap-2">
                              <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCouponApply(); } }}
                                placeholder="Código de cupón"
                                className="flex-1 rounded-full border border-primary/20 px-4 py-2 outline-none focus:border-primary"
                              />
                              <button type="button" onClick={handleCouponApply} className="rounded-full bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90">
                                Aplicar
                              </button>
                            </div>
                            {couponMessage && <p className="text-sm text-primary/70">{couponMessage}</p>}
                          </>
                        ) : (
                          <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-primary/65">
                            Las promociones y cupones están pausados por el momento.
                          </div>
                        )}

                        {/* Desglose */}
                        <div className="flex justify-between"><p className="text-sm text-primary/60">Subtotal:</p><p className="text-sm text-primary/60">{formatPrice(subtotal)}</p></div>
                        {appDiscount > 0 && (
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-green-600">Descuento app 10%:</p>
                            <p className="text-sm font-medium text-green-600">-{formatPrice(appDiscount)}</p>
                          </div>
                        )}
                        {couponDiscount > 0 && appliedCouponCode && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-green-600">Cupón {appliedCouponCode}:</p>
                              <button type="button" onClick={removeCoupon} className="rounded bg-primary/5 px-2 py-0.5 text-sm text-primary/60 hover:text-primary">Quitar</button>
                            </div>
                            <p className="text-sm font-medium text-green-600">-{formatPrice(couponDiscount)}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-lg font-bold text-primary">Total:</p>
                          <p className="font-serif text-3xl text-primary">{formatPrice(total)}</p>
                        </div>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep('payment')}
                          className="mt-6 w-full rounded-2xl bg-primary py-4 font-bold text-white text-lg shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                          Continuar
                          <motion.span
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            className="inline-block"
                          >
                            →
                          </motion.span>
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* PAGO CON MERCADO PAGO */}
              {currentStep === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  {!initPoint ? (
                    <>
                      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">🥡</span>
                          <div>
                            <p className="font-bold text-primary">Take away</p>
                            <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-primary">Nombre para el pedido</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-lg outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                            placeholder="Ingresa tu nombre"
                            autoFocus
                          />
                          {customerName.trim() && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                              <Check className="h-5 w-5 text-green-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-5 space-y-3">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatPrice(subtotal)}</span>
                        </div>
                        {appDiscount > 0 && (
                          <div className="flex justify-between text-green-600 font-medium">
                            <span className="flex items-center gap-1">
                              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                              Descuento App 10%
                            </span>
                            <span>-{formatPrice(appDiscount)}</span>
                          </div>
                        )}
                        {couponDiscount > 0 && appliedCouponCode && (
                          <div className="flex justify-between text-green-600 font-medium">
                            <span className="flex items-center gap-1">
                              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                              Cupon {appliedCouponCode}
                            </span>
                            <span>-{formatPrice(couponDiscount)}</span>
                          </div>
                        )}
                        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">Total a pagar</span>
                          <span className="text-3xl font-bold text-primary">{formatPrice(total)}</span>
                        </div>
                      </div>

                      {paymentError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 flex items-start gap-3"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                            <X className="h-4 w-4 text-red-600" />
                          </div>
                          <p className="text-sm text-red-700">{paymentError}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!customerName.trim() || isCreatingPreference}
                        onClick={handleProceedToPayment}
                        className="w-full rounded-2xl bg-primary py-5 font-bold text-white text-lg shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-3"
                      >
                        {isCreatingPreference ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                            />
                            Preparando...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            Continuar al pago
                          </>
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 text-center"
                    >
                      <div className="py-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100"
                        >
                          <CreditCard className="h-10 w-10 text-blue-600" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-primary mb-2">Listo para pagar</h3>
                        <p className="text-gray-500">
                          <span className="font-bold">{customerName}</span> · {formatPrice(total)}
                        </p>
                        {orderId ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-400">
                            Pedido {orderId.slice(0, 8)}
                          </p>
                        ) : null}
                      </div>

                      <motion.a
                        href={initPoint}
                        rel="noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl py-5 font-bold text-white text-lg shadow-xl transition-all"
                        style={{ backgroundColor: '#009EE3', boxShadow: '0 10px 40px -10px rgba(0, 158, 227, 0.5)' }}
                      >
                        <svg width="28" height="28" viewBox="0 0 120 120" fill="white" aria-hidden="true">
                          <path d="M60 0C26.86 0 0 26.86 0 60s26.86 60 60 60 60-26.86 60-60S93.14 0 60 0zm28.16 87.87c-4.06 4.06-9.26 6.86-15.04 8.08-6.25 1.32-12.84.66-18.75-1.88-5.91-2.54-10.87-6.81-14.38-12.2-3.51-5.39-5.4-11.72-5.4-18.2 0-8.37 3.32-16.4 9.24-22.32 5.92-5.92 13.95-9.24 22.32-9.24 8.37 0 16.4 3.32 22.32 9.24 5.92 5.92 9.24 13.95 9.24 22.32 0 8.77-3.69 17.15-10.15 23.07-.44.41-.9.8-1.38 1.18l1.98-.05z"/>
                        </svg>
                        Pagar con Mercado Pago
                        <ExternalLink size={18} />
                      </motion.a>

                      <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-primary/70">
                        El pedido queda registrado como pendiente hasta que Mercado Pago confirme el pago.
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 rounded-full bg-gray-100">Tarjetas</span>
                        <span className="px-2 py-1 rounded-full bg-gray-100">Debito</span>
                        <span className="px-2 py-1 rounded-full bg-gray-100">Cuenta MP</span>
                        <span className="px-2 py-1 rounded-full bg-gray-100">Efectivo</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setInitPoint(null);
                          setOrderId(null);
                        }}
                        className="text-sm text-gray-400 hover:text-primary transition-colors"
                      >
                        Modificar datos
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
