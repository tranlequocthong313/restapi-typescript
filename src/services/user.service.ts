import { IUser, UserModel } from '../models';

export interface IUserService {
    createUser(user: IUser): Promise<IUser>;
    findOne(query: object): Promise<IUser | null>;
}

class UserService implements IUserService {
    async createUser(user: IUser): Promise<IUser> {
        return await new UserModel(user).save();
    }

    async findOne(query: object): Promise<IUser | null> {
        return await UserModel.findOne(query);
    }

}

export default UserService;
