import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { CartSidebar } from '../components/cart/CartSidebar';

const CheckoutPage = () => {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement payment processing logic here
    // After successful payment, redirect to confirmation page
    router.push('/confirmation');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="cardNumber">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              id="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              required
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="expiryDate">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiryDate"
              id="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handleInputChange}
              required
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="cvv">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              id="cvv"
              value={paymentInfo.cvv}
              onChange={handleInputChange}
              required
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-lg p-2">
            Complete Purchase
          </button>
        </form>
        <CartSidebar />
      </div>
    </div>
  );
};

export default CheckoutPage;