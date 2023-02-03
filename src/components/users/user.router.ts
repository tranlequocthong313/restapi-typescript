import { UserController, UserService, loginSchema, reissueTokenSchema, registerSchema, logoutSchema } from '.';
import { validate } from '../../middlewares';
import { Router } from 'express';

const userRouter = Router();

const userService = new UserService();
const userController = new UserController(userService);

userRouter.post('/signup', validate(registerSchema), userController.signup.bind(userController));
userRouter.post('/signin', validate(loginSchema), userController.signIn.bind(userController));
userRouter.post('/reissue-token', validate(reissueTokenSchema), userController.reIssueToken.bind(userController));
userRouter.delete('/logout', validate(logoutSchema), userController.logout.bind(userController));

export default userRouter;
