import React from 'react';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserOrders } from '../utils/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/footer/Footer';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getUserProfile();
      const userOrders = await getUserOrders();
      setUser(userProfile);
      setOrders(userOrders);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        {user && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            {/* Add more user information as needed */}
          </div>
        )}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Order History</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="border-b py-2">
                  <p>Order ID: {order.id}</p>
                  <p>Total: ${order.total}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;