import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (price <= 0) {
      return res.status(400).json({ success: false, message: "Price must be greater than 0" });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, message: "Stock cannot be negative" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    let sortOptions = {};
    if (sort === 'price_asc') {
      sortOptions.price = 1;
    } else if (sort === 'price_desc') {
      sortOptions.price = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(filter).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
