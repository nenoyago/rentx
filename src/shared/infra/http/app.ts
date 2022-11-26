import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';

import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import '@shared/container';
import errorHandler from '@shared/errors/handler';

import createConnection from '@shared/infra/typeorm';

import swaggerFile from '../../../swagger.json';
import upload from '@config/upload';

import { routes } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

app.use(routes);
app.use(errorHandler);

export { app };
