import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/order.service';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message || 'Error fetching order');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium text-lg">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-lg w-full shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Not Found</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block w-full">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-500">Thank you for your purchase. Your order is confirmed.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Order ID</p>
            <p className="text-lg font-bold text-gray-900">{order._id}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Status</p>
            <span className="bg-indigo-100 text-indigo-800 font-bold px-4 py-2 rounded-lg inline-block">
              {order.status}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>
        <div className="space-y-6 mb-8">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-bold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="font-bold text-gray-900">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 flex justify-between items-center mb-10">
          <span className="text-lg text-gray-500 font-medium">Total Amount Paid</span>
          <span className="text-3xl font-black text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/orders" className="py-4 text-center border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors">
            View All Orders
          </Link>
          <Link to="/products" className="py-4 text-center bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 hover:shadow-lg transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
