import { Request, Response } from "express";
import { Product } from "../model/product";

export class ProductController {
  public listProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  public getProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  public createProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stock, category, image } = req.body;
    try {
      const newProduct = new Product({ name, description, price, stock, category, image });
      const product = await newProduct.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  public updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const product = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  public deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
