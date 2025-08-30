import React from 'react';
import { useCart } from '../../utils/cartContext'; // Assuming you have a context for cart management

const CartSidebar = () => {
  const { cartItems, totalPrice } = useCart();

  return (
    <aside className="cart-sidebar">
      <h2 className="text-lg font-bold">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="total-price">
        <h3 className="font-semibold">Total: ${totalPrice.toFixed(2)}</h3>
      </div>
      <button className="checkout-button">Proceed to Checkout</button>
    </aside>
  );
};

export default CartSidebar;