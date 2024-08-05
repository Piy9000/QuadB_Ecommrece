import mongoose, { Document, Model } from 'mongoose';

interface ProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
}

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    image: { type: String, default: 'https://via.placeholder.com/150' },
  },
  { timestamps: true, versionKey: false }
);

export const Product: Model<ProductDocument> = mongoose.model<ProductDocument>('Product', productSchema);
