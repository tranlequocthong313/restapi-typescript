import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { logger } from '../utils';

export interface IUser extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(config.BCRYPT.SALT);
    const hash = await bcrypt.hashSync(this.password, salt);

    this.password = hash;
    next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password).catch(err => {
        logger.error(err);
        return false;
    });
};

const UserModel = model<IUser>('user', userSchema);

export default UserModel;
