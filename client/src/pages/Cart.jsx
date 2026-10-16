import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [wrap, setWrap] = useState(false);
  const wrapFee = wrap ? 10 : 0;
  const total = subtotal + wrapFee;

  return (
    <div>
      <Header minimal />
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <p className="text-sm text-fasco-muted">
          <Link to="/" className="hover:underline">
            Home
          </Link>{' '}
          / Shopping Cart
        </p>
        <h1 className="mt-2 font-volkhov text-4xl">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-fasco-muted">Your cart is empty.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-flex">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-fasco-line text-sm">
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Quantity</th>
                    <th className="pb-4 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.key} className="border-b border-fasco-line">
                      <td className="py-6">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-24 w-20 object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="mt-1 flex items-center gap-2 text-sm text-fasco-muted">
                              Color
                              <span
                                className="inline-block h-3 w-3 rounded-full border"
                                style={{ backgroundColor: item.color }}
                              />
                              · Size {item.size}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              className="mt-2 text-sm text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">${item.price.toFixed(2)}</td>
                      <td className="py-6">
                        <div className="inline-flex items-center border border-fasco-line">
                          <button
                            type="button"
                            className="px-3 py-1"
                            onClick={() => updateQty(item.key, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            className="px-3 py-1"
                            onClick={() => updateQty(item.key, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-6 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="h-fit border border-fasco-line p-6">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={wrap}
                  onChange={(e) => setWrap(e.target.checked)}
                />
                Wrap The Product (+$10)
              </label>
              <div className="mt-6 flex justify-between border-t border-fasco-line pt-4">
                <span>Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" state={{ wrap }} className="btn-primary mt-6 block w-full text-center">
                Checkout
              </Link>
              <Link to="/cart" className="mt-4 block text-center text-sm underline">
                View Cart
              </Link>
            </aside>
          </div>
        )}
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}
