import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  Building2,
  Calendar,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Home,
  MapPin,
} from 'lucide-react';
import { useCartStore, useCartTotals } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { getProductById } from '@/data/products';
import CheckoutSteps from '@/components/CheckoutSteps';
import {
  detectCardBrand,
  formatCurrency,
  luhnCheck,
  maskCard,
  uid,
} from '@/utils/format';
import type { Address, PaymentInfo } from '@/types';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3 | 4;

const emptyAddr = (): Address => ({
  id: '',
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  phone: '',
});

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const totals = useCartTotals();
  const user = useUserStore((s) => s.profile);
  const placeOrder = useUserStore((s) => s.placeOrder);
  const addAddress = useUserStore((s) => s.addAddress);
  const login = useUserStore((s) => s.login);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(items.length ? 1 : 1);

  const [email, setEmail] = useState(user?.email ?? '');
  const [remember, setRemember] = useState(true);

  const [useSavedAddr, setUseSavedAddr] = useState<string>(user?.addresses?.[0]?.id ?? '');
  const [addr, setAddr] = useState<Address>(
    user?.addresses?.[0] ?? emptyAddr()
  );
  const [addrErrors, setAddrErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const finalShipping = useMemo<Address | null>(() => {
    if (useSavedAddr && user?.addresses.find((a) => a.id === useSavedAddr)) {
      return user.addresses.find((a) => a.id === useSavedAddr)!;
    }
    if (isValidAddr(addr)) return addr;
    return null;
  }, [useSavedAddr, user, addr]);

  const finalPayment = useMemo<PaymentInfo | null>(() => {
    const cardBrand = detectCardBrand(cardNumber);
    const num = cardNumber.replace(/\D/g, '');
    if (
      luhnCheck(cardNumber) &&
      cardHolder.trim().length >= 2 &&
      /^(0[1-9]|1[0-2])\/\d{2,4}$/.test(cardExp) &&
      /^\d{3,4}$/.test(cardCvc) &&
      num.length >= 13
    ) {
      return {
        cardNumberLast4: maskCard(cardNumber),
        cardBrand,
        cardHolder: cardHolder.trim(),
        expiry: cardExp,
      };
    }
    return null;
  }, [cardNumber, cardHolder, cardExp, cardCvc]);

  function isValidAddr(a: Address): a is Address {
    return (
      a.fullName.trim().length > 1 &&
      a.line1.trim().length > 3 &&
      a.city.trim().length > 1 &&
      a.state.trim().length > 1 &&
      /^\d{4,6}$/.test(a.zip.trim()) &&
      a.phone.replace(/\D/g, '').length >= 10
    );
  }

  function validateAddr(): boolean {
    const e: Partial<Record<keyof Address, string>> = {};
    if (!addr.fullName.trim()) e.fullName = 'Required';
    if (!addr.line1.trim()) e.line1 = 'Required';
    if (!addr.city.trim()) e.city = 'Required';
    if (!addr.state.trim()) e.state = 'Required';
    if (!/^\d{4,6}$/.test(addr.zip.trim())) e.zip = 'Invalid ZIP';
    if (addr.phone.replace(/\D/g, '').length < 10) e.phone = 'Invalid phone';
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateCard(): boolean {
    const e: Record<string, string> = {};
    if (!luhnCheck(cardNumber)) e.number = 'Invalid card number';
    if (cardHolder.trim().length < 2) e.holder = 'Enter name on card';
    if (!/^(0[1-9]|1[0-2])\/\d{2,4}$/.test(cardExp)) e.expiry = 'MM/YY required';
    if (!/^\d{3,4}$/.test(cardCvc)) e.cvc = '3-4 digits required';
    setCardErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext(): void {
    if (step === 1) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if (remember) login(email);
      if (!validateAddr()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateCard()) return;
      setStep(3);
    } else if (step === 3) {
      setStep(4);
      finalizeOrder();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finalizeOrder() {
    if (!finalShipping || !finalPayment) return;
    const savedEmail = email || user?.email || 'guest@example.com';
    if (remember) login(savedEmail);
    const savedAddr =
      useSavedAddr && user?.addresses.find((a) => a.id === useSavedAddr)
        ? user.addresses.find((a) => a.id === useSavedAddr)!
        : addAddress(finalShipping);
    const order = placeOrder({
      items,
      totals: {
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
      },
      shipping: { ...finalShipping, id: savedAddr.id || uid('addr') },
      payment: finalPayment,
    });
    clearCart();
    setTimeout(() => navigate(`/order/${order.id}`), 900);
  }

  if (items.length === 0 && step < 4) {
    return (
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="container py-16 text-center">
          <h1 className="font-display text-3xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add items to your cart to check out.</p>
          <Link to="/" className="btn-amazon">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-6">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <Link to="/cart" className="inline-flex items-center gap-1 amazon-link text-base">
            <ChevronLeft size={16} /> Back to cart
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Lock size={14} className="text-amazon-success" />
            Secured checkout
          </div>
        </div>
        <CheckoutSteps current={step} />

        <div className="grid lg:grid-cols-[1fr,360px] gap-6 mt-6 items-start">
          <div className="bg-white rounded-md border shadow-sm overflow-hidden">
            {step === 1 && (
              <StepShell
                num={1}
                title="Shipping address"
                subtitle="Where should we send your package?"
                icon={<Truck size={18} />}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email address" icon={<Mail size={14} />} className="sm:col-span-2" error={/^\S+@\S+\.\S+$/.test(email) ? undefined : email ? 'Invalid' : undefined}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input"
                    />
                  </Field>
                  <label className="sm:col-span-2 text-xs inline-flex items-center gap-2">
                    <input type="checkbox" className="accent-amazon-orange" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    Remember email for next time
                  </label>
                </div>

                {user?.addresses && user.addresses.length > 0 && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold mb-2">Use saved address</div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {user.addresses.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => {
                            setUseSavedAddr(a.id);
                            setAddr(a);
                          }}
                          className={cn(
                            'p-3 text-left rounded-md border text-sm transition-all',
                            useSavedAddr === a.id
                              ? 'border-amazon-orange ring-2 ring-amazon-orange/30 bg-amazon-yellow/10'
                              : 'border-gray-200 hover:bg-gray-50'
                          )}
                        >
                          <div className="font-semibold">{a.fullName}</div>
                          <div className="text-gray-600 text-xs mt-1">
                            {a.line1}, {a.city} {a.state} {a.zip}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="my-4 text-xs text-gray-400 text-center">— Or enter a new address —</div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" icon={<User size={14} />} error={addrErrors.fullName}>
                    <input value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} className="input" placeholder="Jane Doe" />
                  </Field>
                  <Field label="Phone" icon={<Phone size={14} />} error={addrErrors.phone}>
                    <input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} className="input" placeholder="(555) 123-4567" />
                  </Field>
                  <Field label="Address line 1" icon={<Home size={14} />} className="sm:col-span-2" error={addrErrors.line1}>
                    <input value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} className="input" placeholder="Street address, P.O. box" />
                  </Field>
                  <Field label="Address line 2 (optional)" className="sm:col-span-2">
                    <input value={addr.line2 ?? ''} onChange={(e) => setAddr({ ...addr, line2: e.target.value })} className="input" placeholder="Apt, suite, unit, building, floor" />
                  </Field>
                  <Field label="City" error={addrErrors.city}>
                    <input value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className="input" placeholder="New York" />
                  </Field>
                  <Field label="State / Province" error={addrErrors.state}>
                    <input value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className="input" placeholder="NY" />
                  </Field>
                  <Field label="ZIP / Postal code" error={addrErrors.zip}>
                    <input value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} className="input" placeholder="10001" />
                  </Field>
                  <Field label="Country">
                    <select value={addr.country} onChange={(e) => setAddr({ ...addr, country: e.target.value })} className="input bg-white">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </Field>
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                num={2}
                title="Payment method"
                subtitle="All transactions are secure and encrypted."
                icon={<CreditCard size={18} />}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Card number" className="sm:col-span-2" icon={<CreditCard size={14} />} error={cardErrors.number}>
                    <div className="flex items-stretch">
                      <input
                        value={formatCardNumber(cardNumber)}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        maxLength={23}
                        className="input !rounded-r-none flex-1"
                      />
                      <div className="inline-flex items-center px-3 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-xs font-semibold text-gray-700">
                        {detectCardBrand(cardNumber)}
                      </div>
                    </div>
                  </Field>
                  <Field label="Cardholder name" className="sm:col-span-2" icon={<User size={14} />} error={cardErrors.holder}>
                    <input
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="input"
                      placeholder="As it appears on your card"
                    />
                  </Field>
                  <Field label="Expiration date" icon={<Calendar size={14} />} error={cardErrors.expiry}>
                    <input
                      value={formatExp(cardExp)}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="input"
                    />
                  </Field>
                  <Field label="CVC" icon={<ShieldCheck size={14} />} error={cardErrors.cvc}>
                    <input
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      inputMode="numeric"
                      className="input"
                    />
                  </Field>
                </div>
                <div className="mt-4 text-xs text-gray-500 inline-flex items-center gap-2 bg-gray-50 border rounded-md px-3 py-2">
                  <Lock size={14} className="text-amazon-success" />
                  Your card data is protected with TLS 1.3 encryption. We never store your full card number.
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold mb-2">Use test card</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4242 4242 4242 4242');
                        setCardHolder('Jane Doe');
                        setCardExp('12/30');
                        setCardCvc('123');
                      }}
                      className="text-xs border rounded-md px-3 py-1.5 hover:bg-gray-50"
                    >
                      Visa (passes Luhn)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('5555 5555 5555 4444');
                        setCardHolder('John Smith');
                        setCardExp('08/29');
                        setCardCvc('456');
                      }}
                      className="text-xs border rounded-md px-3 py-1.5 hover:bg-gray-50"
                    >
                      Mastercard
                    </button>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                num={3}
                title="Review items & shipping"
                subtitle="Double-check before placing your order"
                icon={<CheckCircle2 size={18} />}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                      <MapPin size={14} className="text-amazon-orange" /> Shipping address
                    </h4>
                    <div className="rounded-md border p-3 text-sm bg-gray-50/50">
                      <div className="font-semibold">{finalShipping?.fullName}</div>
                      <div className="text-gray-700">{finalShipping?.line1}</div>
                      {finalShipping?.line2 && <div className="text-gray-700">{finalShipping.line2}</div>}
                      <div className="text-gray-700">
                        {finalShipping?.city}, {finalShipping?.state} {finalShipping?.zip}
                      </div>
                      <div className="text-gray-700">{finalShipping?.country}</div>
                      <div className="text-gray-500 text-xs mt-1">{finalShipping?.phone}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                      <CreditCard size={14} className="text-amazon-orange" /> Payment method
                    </h4>
                    <div className="rounded-md border p-3 text-sm bg-gray-50/50">
                      <div className="font-semibold flex items-center gap-2">
                        <Building2 size={14} /> {finalPayment?.cardBrand} ending in {finalPayment?.cardNumberLast4}
                      </div>
                      <div className="text-gray-700">{finalPayment?.cardHolder}</div>
                      <div className="text-gray-700">Expires {finalPayment?.expiry}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-bold mb-2">Items in order</h4>
                  <ul className="divide-y divide-gray-100 rounded-md border overflow-hidden">
                    {items.map((it) => {
                      const p = getProductById(it.productId);
                      if (!p) return null;
                      return (
                        <li key={p.id} className="p-3 flex gap-3 items-center bg-white">
                          <div className="w-14 h-14 shrink-0 rounded overflow-hidden bg-gray-100 border">
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm line-clamp-1 font-medium">{p.title}</div>
                            <div className="text-xs text-gray-500">Qty {it.quantity}</div>
                          </div>
                          <div className="text-sm font-semibold">{p.currency}{(p.price * it.quantity).toFixed(2)}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell num={4} title="Placing your order…" subtitle="Almost done!" icon={<CheckCircle2 size={18} />}>
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-amazon-yellow/60 border-t-amazon-orange animate-spin" />
                    <CheckCircle2 size={24} className="absolute inset-0 m-auto text-amazon-success animate-scale-in" />
                  </div>
                  <div className="mt-5 font-display text-xl font-bold">Thank you!</div>
                  <p className="text-sm text-gray-600">Redirecting you to your receipt…</p>
                </div>
              </StepShell>
            )}

            {step < 4 && (
              <div className="px-5 md:px-8 pb-6 pt-3 flex justify-between items-center border-t bg-gray-50/40">
                <button
                  onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
                  disabled={step === 1}
                  className="btn-amazon-outline !py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                <button
                  onClick={goNext}
                  className="btn-amazon !py-2.5 px-6 text-sm font-semibold"
                >
                  {step === 1 ? 'Continue to payment' : step === 2 ? 'Continue to review' : 'Place your order'}
                </button>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-[130px] space-y-4">
            <div className="bg-white rounded-md border p-5 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-1.5">
                <Lock size={16} className="text-amazon-success" /> Order Summary
              </h3>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-3 mb-4">
                {items.map((it) => {
                  const p = getProductById(it.productId);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="flex gap-2 items-start text-xs">
                      <div className="w-10 h-10 rounded shrink-0 overflow-hidden bg-gray-100 border">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="line-clamp-2 font-medium">{p.title}</div>
                        <div className="text-gray-500">Qty {it.quantity}</div>
                      </div>
                      <div className="font-semibold">{p.currency}{(p.price * it.quantity).toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
              <dl className="space-y-1.5 text-sm">
                <SummaryRow label="Items:" value={`$${totals.subtotal.toFixed(2)}`} />
                {totals.discount > 0 && (
                  <SummaryRow label="Promo:" value={`-$${totals.discount.toFixed(2)}`} valueClass="text-amazon-success" />
                )}
                <SummaryRow label="Shipping:" value={totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`} valueClass={totals.shipping === 0 ? 'text-amazon-success font-semibold' : ''} />
                <SummaryRow label="Tax (est.):" value={`$${totals.tax.toFixed(2)}`} />
              </dl>
              <hr className="my-3" />
              <div className="flex items-baseline justify-between">
                <div className="font-bold">Order total</div>
                <div className="text-2xl font-bold text-amazon-deal">${totals.total.toFixed(2)}</div>
              </div>
              <div className="mt-4 text-[11px] text-gray-500 bg-gray-50 border rounded p-2">
                By placing your order, you agree to Amazon.clone’s privacy notice and conditions of use.
              </div>
            </div>
          </aside>
        </div>
      </div>
      <style>{`
        .input {
          width: 100%;
          border: 1px solid rgb(209 213 219);
          border-radius: 0.375rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          background: white;
          transition: all 0.15s ease;
          outline: none;
        }
        .input:focus {
          border-color: #FF9900;
          box-shadow: 0 0 0 3px rgba(255,153,0,0.18);
        }
      `}</style>
    </div>
  );
}

function StepShell({
  num,
  title,
  subtitle,
  icon,
  children,
}: {
  num: number;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3 px-5 md:px-8 pt-6 pb-4 border-b bg-gradient-to-b from-amazon-yellow/10 to-white">
        <div className="w-9 h-9 rounded-full bg-amazon-orange text-white inline-flex items-center justify-center font-bold shadow shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-5 md:px-8 py-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon,
  error,
  className,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn('block text-sm', className)}>
      <div className="mb-1 inline-flex items-center gap-1.5 text-gray-700 font-medium">
        {icon}
        {label}
      </div>
      {children}
      {error && <div className="mt-1 text-xs text-amazon-deal">{error}</div>}
    </label>
  );
}

function SummaryRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-gray-600">{label}</dt>
      <dd className={`font-medium ${valueClass ?? ''}`}>{value}</dd>
    </div>
  );
}

function formatCardNumber(s: string) {
  const d = s.replace(/\D/g, '').slice(0, 19);
  return d.replace(/(\d{4})(?=\d)/g, '$1 ');
}
function formatExp(s: string) {
  const d = s.replace(/\D/g, '').slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}
