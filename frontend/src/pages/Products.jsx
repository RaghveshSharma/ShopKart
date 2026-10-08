import React, { useState, useEffect } from "react";
import { getProducts } from "../services/product.service";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    // Debounce logic for search
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(search, category, sort);
      setProducts(data.products || []);
      
      // Fetch wishlist
      try {
        const { getWishlist } = await import("../services/wishlist.service");
        const wishlistData = await getWishlist();
        // The API returns wishlist populated, but we just need IDs for checking
        const ids = wishlistData.wishlist.map(p => typeof p === 'object' ? p._id : p);
        setWishlistIds(ids);
      } catch (wErr) {
        console.error("Failed to load wishlist", wErr);
      }
    } catch (err) {
      setError(err.message || "Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-6 mb-10 relative z-20">
          <SearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#2A5A4A]/20 border-t-[#2A5A4A] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#3f4740] font-medium">Loading amazing products...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-card border-red-200/50 bg-red-50/50 p-10 text-center max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-white border border-red-200 text-red-700 px-8 py-3 rounded-full font-bold hover:bg-red-50 hover:shadow-sm transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="glass-card p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E3B8B2]/10 rounded-full blur-3xl -z-10"></div>
            <div className="w-24 h-24 bg-[#FDF9F1] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#2A5A4A]/10">
              <svg className="w-12 h-12 text-[#2A5A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1B3B30] mb-3">No products found</h3>
            <p className="text-[#3f4740] max-w-md mx-auto mb-8 font-medium">
              We couldn't find any products matching your current filters. Try adjusting your search or category.
            </p>
            <button 
              onClick={() => { setSearch(""); setCategory(""); setSort(""); }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                isInitiallySaved={wishlistIds.includes(product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
