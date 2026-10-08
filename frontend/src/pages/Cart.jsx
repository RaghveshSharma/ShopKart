import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, loading, error, updateQuantity, removeFromCart, subtotal, totalItems, isLoggedIn } = useCart();
    const navigate = useNavigate();

    if (!isLoggedIn) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-4">Please log in first</h2>
                <p className="text-gray-500 mb-8">You need to be logged in to view and manage your cart.</p>
                <Link
                    to="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block font-semibold"
                >
                    Login
                </Link>
            </div>
        );
    }

    if (loading && cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-4">Your cart is empty 🛒</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    to="/products"
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block font-semibold"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    const handleQuantityUpdate = async (productId, currentQuantity, newQuantity, maxStock) => {
        if (newQuantity < 1) return;
        if (newQuantity > maxStock) {
            alert(`Sorry, you cannot add more than ${maxStock} units of this product.`);
            return;
        }
        await updateQuantity(productId, newQuantity);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">My Cart</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="flex-1">
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 gap-4">
                                <img
                                    src={item.product.image || 'https://via.placeholder.com/150'}
                                    alt={item.product.name}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                                    <p className="text-blue-600 font-medium">₹{item.product.price.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">Stock available: {item.product.stock}</p>
                                </div>
                                <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity, item.quantity - 1, item.product.stock)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="font-medium w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity, item.quantity + 1, item.product.stock)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                            disabled={item.quantity >= item.product.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="font-semibold text-gray-800">
                                        ₹{(item.product.price * item.quantity).toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-80">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Items:</span>
                            <span className="font-medium">{totalItems}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                            <span className="text-lg font-semibold">Subtotal:</span>
                            <span className="text-xl font-bold text-blue-600">
                                ₹{subtotal.toLocaleString()}
                            </span>
                        </div>
                        <Link
                            to="/checkout"
                            className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition block text-center"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
