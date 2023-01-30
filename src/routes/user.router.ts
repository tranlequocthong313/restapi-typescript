import { UserController } from '../controllers';
import { UserService } from '../services';
import { validate } from '../middlewares';
import { loginSchema, reissueTokenSchema, registerSchema, logoutSchema } from '../validations';
import { Router } from 'express';

const routes = Router();

const userService = new UserService();
const userController = new UserController(userService);

routes.post('/signup', validate(registerSchema), userController.signup.bind(userController));
routes.post('/signin', validate(loginSchema), userController.signIn.bind(userController));
routes.post('/reissue-token', validate(reissueTokenSchema), userController.reIssueToken.bind(userController));
routes.delete('/logout', validate(logoutSchema), userController.logout.bind(userController));

export default routes;
