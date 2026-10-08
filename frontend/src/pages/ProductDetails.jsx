import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../services/product.service";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { cartItems, addToCart } = useCart();

  const cartItem = product ? cartItems.find(item => item.product?._id === product._id) : null;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      setProduct(data.product);
    } catch (err) {
      setError(err.message || "Something went wrong while loading product details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-lg w-full shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block w-full">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors group">
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Catalog
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery */}
            <div className="w-full lg:w-1/2 bg-gray-50 p-8 lg:p-12 flex items-center justify-center min-h-[400px]">
              <img 
                src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"} 
                alt={product.name}
                className="max-w-full max-h-[500px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase">
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="text-4xl font-black text-gray-900 mb-8">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              <div className="prose prose-lg text-gray-500 mb-10 flex-grow">
                <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              <div className="mt-auto">
                {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    console.log("Add to cart clicked for", product._id);
                    setIsAdding(true);
                    const res = await addToCart(product._id);
                    console.log("Add to cart result", res);
                    if (!res.success) {
                      if (res.message === 'unauthorized') {
                        navigate("/login");
                      } else {
                        setErrorMsg(res.message);
                        setTimeout(() => setErrorMsg(""), 3000);
                      }
                    }
                    setIsAdding(false);
                  }}
                  disabled={isAdding || product.stock <= 0 || (cartItem && cartItem.quantity >= product.stock)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                    product.stock > 0 && (!cartItem || cartItem.quantity < product.stock)
                      ? 'bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {isAdding ? "Adding..." : (product.stock <= 0 ? "Out of Stock" : (cartItem ? "Add Another" : "Add to Cart"))}
                </button>
                <p className="text-center text-sm text-gray-400 mt-4">
                  Free shipping on orders over ₹499
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
