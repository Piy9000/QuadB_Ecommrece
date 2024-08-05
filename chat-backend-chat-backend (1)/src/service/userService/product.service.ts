import { Request } from 'express';
import { Product } from '../../model/product';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface ProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
}

// Create a new product
export const createProduct = async (req: Request) => {
  const { name, description, price, stock, category, image } = req.body;

  try {
    const product: ProductDocument = await Product.create({ 
      _id: uuidv4(), 
      name, 
      description, 
      price, 
      stock, 
      category, 
      image 
    });
    return { ...product.toObject() };
  } catch (error) {
    // Type assertion for error
    return { error: (error as Error).message };
  }
};

// Get a product by ID
export const getProduct = async (req: Request) => {
  const { id } = req.params;

  try {
    const product: ProductDocument | null = await Product.findById(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    return { ...product.toObject() };
  } catch (error) {
    // Type assertion for error
    return { error: (error as Error).message };
  }
};

// Update a product by ID
export const updateProduct = async (req: Request) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product: ProductDocument | null = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return { error: 'Product not found' };
    }
    return { ...product.toObject() };
  } catch (error) {
    // Type assertion for error
    return { error: (error as Error).message };
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request) => {
  const { id } = req.params;

  try {
    const product: ProductDocument | null = await Product.findByIdAndDelete(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    return { message: 'Product deleted successfully' };
  } catch (error) {
    // Type assertion for error
    return { error: (error as Error).message };
  }
};

// List all products (with optional filtering)
export const listProducts = async (req: Request) => {
  const { category, minPrice, maxPrice } = req.query;

  try {
    const query: any = {};
    if (category) query.category = category;
    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    const products: ProductDocument[] = await Product.find(query);
    return products.map(product => product.toObject());
  } catch (error) {
    // Type assertion for error
    return { error: (error as Error).message };
  }
};
