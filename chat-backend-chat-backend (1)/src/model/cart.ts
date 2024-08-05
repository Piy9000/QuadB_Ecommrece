import mongoose, { Document, Model } from 'mongoose';

interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
}

const cartSchema = new mongoose.Schema<CartDocument>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

export const Cart: Model<CartDocument> = mongoose.model<CartDocument>('Cart', cartSchema);
