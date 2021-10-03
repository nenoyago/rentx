import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { categoriesRoutes } from './categories.routes';
import { specificationsRoutes } from './specifications.routes';
import { carsRoutes } from './cars.routes';
import { rentalRoutes } from './rental.routes';
import { authenticateRoutes } from './authenticate.routes';
import { passwordRoutes } from './password.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);
routes.use('/cars', carsRoutes);
routes.use('/rentals', rentalRoutes);
routes.use('/password', passwordRoutes);

routes.use(authenticateRoutes);

export { routes };
