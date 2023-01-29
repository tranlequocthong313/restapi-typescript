import { UserController } from '../controllers';
import { UserService } from '../services';
import { validate } from '../middlewares';
import { loginSchema, reissueToken, registerSchema } from '../validations';
import { Router } from 'express';

const routes = Router();

const userService = new UserService();
const userController = new UserController(userService);

routes.post('/signup', validate(registerSchema), userController.signup.bind(userController));
routes.post('/signin', validate(loginSchema), userController.signIn.bind(userController));
routes.post('/reissue-token', validate(reissueToken), userController.reIssueToken.bind(userController));

export default routes;
