import React, { useEffect, useState } from 'react';
import { fetchUserProfile, fetchUserOrders } from '../utils/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/footer/Footer';

interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

interface Order {
  id: string;
  total: number;
  date: string;
  // Add more fields as needed
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual user id if needed
        const userProfile = await fetchUserProfile("me");
        const userOrders = await fetchUserOrders("me");
        setUser(userProfile);
        setOrders(userOrders);
      } catch (error) {
        // Handle error if needed
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {user && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                {user.address && <p>Address: {user.address}</p>}
                {user.phone && <p>Phone: {user.phone}</p>}
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
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;