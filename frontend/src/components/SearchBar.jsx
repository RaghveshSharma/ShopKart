import React from "react";

const SearchBar = ({ search, setSearch, category, setCategory, sort, setSort }) => {
  const categories = [
    "Electronics",
    "Fashion",
    "Books",
    "Home",
    "Sports",
    "Toys"
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-1/2 lg:w-2/3">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-700"
        />
      </div>

      <div className="flex w-full md:w-auto gap-3">
        {/* Category Filter */}
        <div className="w-1/2 md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter (Bonus Challenge) */}
        <div className="w-1/2 md:w-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">Sort By: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
