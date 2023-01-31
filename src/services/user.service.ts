import { DocumentDefinition } from 'mongoose';
import { IUser, UserModel } from '../models';

export interface IUserService {
    createUser(user: OmitUser): Promise<IUser>;
    findOne(query: object): Promise<IUser | null>;
}

type OmitUser = DocumentDefinition<Omit<IUser, 'createdAt' | 'updatedAt' | 'comparePassword'>>;

class UserService implements IUserService {
    async createUser(user: OmitUser): Promise<IUser> {
        return await new UserModel(user).save();
    }

    async findOne(query: object): Promise<IUser | null> {
        return await UserModel.findOne(query);
    }

}

export default UserService;
