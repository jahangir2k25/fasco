import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const wrap = location.state?.wrap || false;

  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: user?.email || '',
    country: 'United States',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    postalCode: '',
    saveDelivery: false,
    paymentMethod: 'Credit Card',
    cardNumber: '',
    expiration: '',
    securityCode: '',
    cardholderName: '',
    savePayment: false,
  });

  const shipping = subtotal > 150 ? 0 : 15;
  const wrapFee = wrap ? 10 : 0;
  const total = Math.max(0, subtotal + shipping + wrapFee - discount);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const applyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'FASCO10') {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
      alert('Invalid code. Try FASCO10');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        orderItems: items.map((i) => ({
          product: i.productId,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        contactEmail: form.email,
        shippingAddress: {
          country: form.country,
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        paymentMethod: form.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        discount,
        totalPrice: total,
        wrapProduct: wrap,
      });
      clearCart();
      navigate('/', { state: { orderId: data._id } });
      alert('Payment successful! Order placed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div>
        <Header minimal />
        <div className="py-24 text-center">
          <p className="text-fasco-muted">No items to checkout.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header minimal />
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <p className="text-sm text-fasco-muted">
          <Link to="/" className="hover:underline">
            Home
          </Link>{' '}
          / Checkout
        </p>
        <h1 className="mt-2 font-volkhov text-4xl">FASCO Demo Checkout</h1>

        <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-medium">Contact</h2>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                className="mt-4 w-full border border-fasco-line px-4 py-3"
              />
              <p className="mt-2 text-sm text-fasco-muted">
                Have an account?{' '}
                <Link to="/signup" className="underline">
                  Create Account
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium">Delivery</h2>
              <select
                name="country"
                value={form.country}
                onChange={onChange}
                className="mt-4 w-full border border-fasco-line px-4 py-3"
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Bangladesh</option>
              </select>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="First Name"
                  className="border border-fasco-line px-4 py-3"
                />
                <input
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="Last Name"
                  className="border border-fasco-line px-4 py-3"
                />
              </div>
              <input
                name="address"
                required
                value={form.address}
                onChange={onChange}
                placeholder="Address"
                className="mt-3 w-full border border-fasco-line px-4 py-3"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  name="city"
                  required
                  value={form.city}
                  onChange={onChange}
                  placeholder="City"
                  className="border border-fasco-line px-4 py-3"
                />
                <input
                  name="postalCode"
                  required
                  value={form.postalCode}
                  onChange={onChange}
                  placeholder="Postal Code"
                  className="border border-fasco-line px-4 py-3"
                />
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="saveDelivery"
                  checked={form.saveDelivery}
                  onChange={onChange}
                />
                Save this information for next time
              </label>
            </section>

            <section>
              <h2 className="text-xl font-medium">Payment</h2>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={onChange}
                className="mt-4 w-full border border-fasco-line px-4 py-3"
              >
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Cash on Delivery</option>
              </select>
              <div className="mt-2 flex gap-2 text-xs text-fasco-muted">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>Amex</span>
              </div>
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={onChange}
                placeholder="Card Number"
                className="mt-3 w-full border border-fasco-line px-4 py-3"
                required={form.paymentMethod === 'Credit Card'}
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  name="expiration"
                  value={form.expiration}
                  onChange={onChange}
                  placeholder="Expiration (MM/YY)"
                  className="border border-fasco-line px-4 py-3"
                  required={form.paymentMethod === 'Credit Card'}
                />
                <input
                  name="securityCode"
                  value={form.securityCode}
                  onChange={onChange}
                  placeholder="Security Code"
                  className="border border-fasco-line px-4 py-3"
                  required={form.paymentMethod === 'Credit Card'}
                />
              </div>
              <input
                name="cardholderName"
                value={form.cardholderName}
                onChange={onChange}
                placeholder="Cardholder Name"
                className="mt-3 w-full border border-fasco-line px-4 py-3"
                required={form.paymentMethod === 'Credit Card'}
              />
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="savePayment"
                  checked={form.savePayment}
                  onChange={onChange}
                />
                Save this information for next time
              </label>
            </section>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto">
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          <aside className="h-fit border border-fasco-line p-6 lg:sticky lg:top-24">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="h-16 w-14 object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-fasco-muted">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Discount code"
                className="flex-1 border border-fasco-line px-3 py-2 text-sm"
              />
              <button type="button" onClick={applyDiscount} className="btn-outline px-4 py-2 text-sm">
                Apply
              </button>
            </div>

            <div className="mt-6 space-y-2 border-t border-fasco-line pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {wrap && (
                <div className="flex justify-between">
                  <span>Gift wrap</span>
                  <span>${wrapFee.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-fasco-line pt-3 text-base font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}
