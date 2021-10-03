import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/listAvailableCarsController';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';

const uploadCarImages = multer(uploadConfig);

const carsRoutes = Router();

const createCarController = new CreateCarController();
const createCarSpecificationController = new CreateCarSpecificationController();
const listAvailableCarsController = new ListAvailableCarsController();
const uploadCarImagesController = new UploadCarImagesController();

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);
carsRoutes.post(
  '/specifications/:id',
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationController.handle
);
carsRoutes.post(
  '/images/:id',
  ensureAuthenticated,
  ensureAdmin,
  uploadCarImages.array('images'),
  uploadCarImagesController.handle
);

carsRoutes.get('/available', listAvailableCarsController.handle);

export { carsRoutes };
