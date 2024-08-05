import { Request } from 'express';
import { Cart, CartDocument } from '../../model/cart';
import { Product } from '../../model/product';

// Create a new cart or update an existing cart
export const createOrUpdateCart = async (req: Request) => {
  const { userId, items } = req.body;

  try {
    // Check if cart exists
    let cart = await Cart.findOne({ userId }).exec();
    
    if (cart) {
      // Update existing cart
      cart.items = items;
      await cart.save();
      return { ...cart.toObject() };
    } else {
      // Create new cart
      cart = await Cart.create({ userId, items });
      return { ...cart.toObject() };
    }
  } catch (error) {
    return { error: (error as Error).message };
  }
};

// Get a cart by user ID
export const getCart = async (req: Request) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).exec();
    if (!cart) {
      return { error: 'Cart not found' };
    }
    return { ...cart.toObject() };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

// Add an item to the cart
export const addItemToCart = async (req: Request) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId }).exec();
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ productId, quantity });
      }
      
      await cart.save();
    }
    
    return { ...cart.toObject() };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

// Remove an item from the cart
export const removeItemFromCart = async (req: Request) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).exec();
    
    if (!cart) {
      return { error: 'Cart not found' };
    }

    // Remove the item
    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();

    return { ...cart.toObject() };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

// Clear the cart
export const clearCart = async (req: Request) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).exec();
    
    if (!cart) {
      return { error: 'Cart not found' };
    }

    cart.items = [];
    await cart.save();

    return { message: 'Cart cleared successfully' };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

// List all carts (for administrative purposes)
export const listCarts = async (req: Request) => {
  try {
    const carts = await Cart.find().exec();
    return carts.map(cart => cart.toObject());
  } catch (error) {
    return { error: (error as Error).message };
  }
};
