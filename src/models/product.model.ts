import { Document, Schema, Types, model } from 'mongoose';
import { IUser } from './user.model';
import { v4 as uuidv4 } from 'uuid';

export interface IProduct extends Document {
    userId: IUser['_id'];
    title: string;
    description: string;
    price: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema({
    productId: { type: String, unique: true, required: true, default: () => `product:${uuidv4()}` },
    userId: { type: Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true
});

const ProductModel = model<IProduct>('product', productSchema);

export default ProductModel;
