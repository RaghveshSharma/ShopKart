import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createPaymentOrder, verifyPayment } from '../services/order.service';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, subtotal, emptyCart, isLoggedIn } = useCart();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [isLoggedIn, cartItems, navigate]);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!shippingAddress.fullName.trim() || !shippingAddress.phone.trim() || !shippingAddress.addressLine1.trim() || !shippingAddress.city.trim() || !shippingAddress.state.trim() || !shippingAddress.pincode.trim()) {
      return "All fields are required and cannot be empty whitespace.";
    }
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      return "Phone number must be exactly 10 digits.";
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      return "Pincode must contain 6 digits.";
    }
    return null;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Payment Order on backend
      const data = await createPaymentOrder(shippingAddress);

      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      // 2. Load Razorpay Script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            // 4. Verify Payment on backend
            const verifyData = await verifyPayment({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyData.success) {
              emptyCart();
              navigate(`/order-success/${data.shopKartOrderId}`);
            } else {
              setErrorMsg(verifyData.message || "Payment verification failed.");
            }
          } catch (err) {
            setErrorMsg(err.message || "Error verifying payment");
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response) {
        setIsProcessing(false);
        setErrorMsg(`Payment failed: ${response.error.description}. Your cart has not been cleared. Please try again.`);
      });

      paymentObject.open();

    } catch (err) {
      setErrorMsg(err.error || err.message || "An unexpected error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  if (!isLoggedIn || cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Details</h2>
              
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line</label>
                  <input 
                    type="text" 
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    placeholder="123 Street Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      placeholder="Bengaluru"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      placeholder="Karnataka"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input 
                      type="text" 
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      placeholder="560001"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 ${
                      isProcessing ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order & Pay'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate pr-4">
                      {item.product.name} <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-gray-900 shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center text-lg font-black text-gray-900">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
