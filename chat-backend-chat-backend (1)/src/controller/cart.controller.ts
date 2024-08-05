import { Request, Response } from 'express';
import { Cart } from '../model/cart'; 


interface AuthenticatedRequest extends Request {
  user?: {
    id: string; 
  };
}

export class CartController {
  // Get the user's shopping cart
  public getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id; // Access the user ID
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      return res.json(cart);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  // Add an item to the cart
  public addToCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id; // Access the user ID
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { productId, quantity } = req.body;
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $push: { items: { productId, quantity } } },
        { new: true, upsert: true }
      );

      return res.json(cart);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  // Remove an item from the cart
  public removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id; // Access the user ID
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { itemId } = req.params;
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
      );

      return res.json(cart);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };
}
