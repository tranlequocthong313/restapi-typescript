import { FilterQuery, QueryOptions } from 'mongoose';
import { IUser, IUserInput, UserModel } from '../models';
import { jwt } from '../utils';
import { redis } from '../databases';
import config from '../../config';

export interface IUserService {
    createUser(user: IUserInput): Promise<IUser>;
    findOne(query: FilterQuery<IUser>, options?: QueryOptions<IUser>): Promise<IUser | null>;
    reIssueTokenPair(refreshToken: string): Promise<TokenPair>;
    logout(refreshToken: string): Promise<number>;
    getUserWithTokenPair(user: IUser): Promise<object>;
}

type TokenPair = { accessToken: string, refreshToken: string; };
type TokenPayload = { _id: string; };

class UserService implements IUserService {
    async logout(refreshToken: string): Promise<number> {
        const payload = await jwt.verifyRefreshToken(refreshToken, config.JWT.REFRESH_TOKEN_SECRET);
        return await redis.del(payload._id.toString());
    }

    async reIssueTokenPair(refreshToken: string): Promise<TokenPair> {
        const payload = await jwt.verifyRefreshToken(refreshToken, config.JWT.REFRESH_TOKEN_SECRET);
        return await this.getTokens({ _id: payload._id });
    }

    async createUser(user: IUserInput): Promise<IUser> {
        return await new UserModel(user).save();
    }

    async findOne(query: FilterQuery<IUser>, options?: QueryOptions<IUser>): Promise<IUser | null> {
        return await UserModel.findOne(query, null, options);
    }

    async getUserWithTokenPair(user: IUser): Promise<object> {
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            ...(await this.getTokens({ _id: user._id }))
        };
    }

    private async getTokens(payload: TokenPayload): Promise<TokenPair> {
        const [accessToken, refreshToken] = [
            jwt.signToken(payload, config.JWT.ACCESS_TOKEN_SECRET, { expiresIn: config.JWT.ACCESS_EXPIRES_IN }),
            jwt.signToken(payload, config.JWT.REFRESH_TOKEN_SECRET, { expiresIn: config.JWT.REFRESH_EXPIRES_IN })
        ];

        await redis.set(payload._id, refreshToken, 'EX', config.JWT.REFRESH_EXPIRES_IN);
        return { accessToken, refreshToken };
    }
}

export default UserService;
