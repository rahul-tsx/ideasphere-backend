import { UserInterface } from '../models/user.model';
import { rolesTypes } from './misc.types';

declare global {
	namespace Express {
		interface Request {
			user?: UserInterface;
			role: rolesTypes;
		}
	}
}
