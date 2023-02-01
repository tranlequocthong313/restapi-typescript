import { FilterQuery, QueryOptions } from 'mongoose';
import { IUser, IUserInput, UserModel } from '../models';

export interface IUserService {
    createUser(user: IUserInput): Promise<IUser>;
    findOne(query: FilterQuery<IUser>, options?: QueryOptions<IUser>): Promise<IUser | null>;
}

class UserService implements IUserService {
    async createUser(user: IUserInput): Promise<IUser> {
        return await new UserModel(user).save();
    }

    async findOne(query: FilterQuery<IUser>, options?: QueryOptions<IUser>): Promise<IUser | null> {
        return await UserModel.findOne(query, null, options);
    }

}

export default UserService;
