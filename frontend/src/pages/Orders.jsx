import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/order.service';
import { useCart } from '../context/CartContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useCart();

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center p-4">
        <div className="glass-card p-10 text-center max-w-lg w-full">
          <h2 className="text-3xl font-serif font-black text-[#1B3B30] mb-3">Please log in first</h2>
          <p className="text-[#3f4740] mb-8 font-medium">You need to be logged in to view your orders.</p>
          <Link to="/login" className="btn-primary w-full">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#2A5A4A]/20 border-t-[#2A5A4A] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#3f4740] font-medium text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 pt-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-black text-[#1B3B30] mb-8 relative inline-block">
          My <span className="text-gradient">Orders</span>
          <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#E3B8B2] rounded-full"></div>
        </h1>
        
        {orders.length === 0 ? (
          <div className="glass-card p-16 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E3B8B2]/10 rounded-full blur-3xl -z-10"></div>
            <div className="w-24 h-24 bg-[#FDF9F1] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#2A5A4A]/10">
              <svg className="w-10 h-10 text-[#2A5A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1B3B30] mb-3">No orders yet</h2>
            <p className="text-[#3f4740] mb-8 font-medium">You haven't placed any orders. Start exploring our products!</p>
            <Link to="/products" className="btn-primary inline-flex">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-[#2A5A4A]/10 p-6 sm:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-[#2A5A4A]/10">
                  <div>
                    <p className="text-xs text-[#3f4740] font-bold uppercase tracking-wider mb-1">Order #{order._id.substring(0, 8)}</p>
                    <p className="font-medium text-[#1B3B30]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-left sm:text-right">
                    <span className="bg-[#E3B8B2]/20 text-[#1B3B30] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block mb-2 border border-[#E3B8B2]/50">
                      {order.status}
                    </span>
                    <p className="font-serif font-black text-2xl text-[#1B3B30]">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-[#FDF9F1] p-3 rounded-2xl">
                      <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img 
                          src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop";
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-[#1B3B30] mb-1">{item.name}</p>
                        <p className="text-xs text-[#3f4740] font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Link 
                    to={`/order-success/${order._id}`}
                    className="text-[#2A5A4A] hover:text-[#1B3B30] font-bold text-sm tracking-wider uppercase transition-colors flex items-center gap-1"
                  >
                    View Details 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
