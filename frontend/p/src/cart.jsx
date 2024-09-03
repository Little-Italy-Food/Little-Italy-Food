import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../src/cartcontext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const formatPrice = (price) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    return numPrice.toFixed(2);
  };

  const total = cart.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto mt-10 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-blue-500 hover:text-blue-600">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl || "/api/placeholder/100/100"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <span className="font-semibold">{item.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">${formatPrice(item.price)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="text-gray-500 focus:outline-none focus:text-gray-600"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="mx-2 text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="text-gray-500 focus:outline-none focus:text-gray-600"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">${formatPrice(item.price * item.quantity)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Clear Cart
        </button>
        <div className="text-xl font-bold">
          Total: ${formatPrice(total)}
        </div>
      </div>
      <div className="mt-4 text-right">
        <Link
          to="/checkout"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;